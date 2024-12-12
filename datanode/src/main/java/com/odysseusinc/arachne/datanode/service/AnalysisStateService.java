/*
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.odysseusinc.arachne.datanode.service;

import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisCommand;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisState;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry;
import com.odysseusinc.arachne.datanode.repository.AnalysisRepository;
import com.odysseusinc.arachne.datanode.repository.AnalysisStateJournalRepository;
import com.odysseusinc.arachne.datanode.util.Fn;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class AnalysisStateService {
    @Autowired
    private AnalysisStateJournalRepository analysisStateJournalRepository;
    @Autowired
    private AnalysisRepository analysisRepository;

    @Transactional
    public void handleStateFromEE(Analysis analysis, String stage, String error) {
        String reason = Optional.ofNullable(error).orElse("Update from Execution Engine");
        updateState(analysis, null, stage, error, reason);
    }

    @Transactional
    public void updateState(Long analysisId, String reason) {
        updateState(analysisId, null, reason, null);
    }

    @Transactional
    public void updateState(Long analysisId, String reason, String error) {
        updateState(analysisId, null, reason, error);
    }

    @Transactional
    public void updateState(Long analysisId, AnalysisCommand command, String reason, String error) {
        this.analysisRepository.findById(analysisId).ifPresent(analysis ->
                updateState(analysis, command, null, error, reason)
        );
    }

    //TODO There’s a chance two threads/transactions could run this at the same time,
    // which might mess up the currentState if they both try to set it.
    @Transactional
    public void updateState(Analysis analysis, AnalysisCommand command, String stage, String error, String reason) {
        Optional<AnalysisStateEntry> currentState = Optional.ofNullable(analysis.getCurrentState());
        Boolean hasChanged = currentState.map(s ->
                s.getCommand() != command || !Objects.equals(s.getStage(), stage) || !Objects.equals(s.getError(), error)
        ).orElse(true);
        if (hasChanged) {
            Instant current = Instant.now();
            AnalysisStateEntry history = Fn.create(AnalysisStateEntry::new, st -> {
                        st.setDate(Date.from(current));
                        st.setAnalysis(analysis);
                        st.setReason(reason);
                        st.setError(error);
                        st.setCommand(command);
                        st.setStage(ObjectUtils.defaultIfNull(stage, currentState.map(AnalysisStateEntry::getStage).orElse(null)));
                    }
            );
            analysisStateJournalRepository.save(history);
            if (!currentState.isPresent()) {
                analysis.setCreated(current);
            }
            analysis.setCurrentState(history);
            analysis.setState(toState(error, command, stage));
            log.info("Analysis [{}] state updated to {} ({}), determined from command: '{}', stage: '{}', error: '{}'", analysis.getId(), analysis.getState(), reason, command, analysis.getStage(), error);
        } else if (Objects.equals(currentState.map(AnalysisStateEntry::getReason).orElse(null), reason)) {
            log.info("Analysis [{}] is already in state {} (new reason [{}])", analysis.getId(), command, reason);
        }
    }

    public static AnalysisState toState(String error, AnalysisCommand command, String stage) {
        if (StringUtils.isNotEmpty(error)) {
            return (command == AnalysisCommand.ABORT && Objects.equals(stage, Stage.EXECUTE))
                    ? AnalysisState.ABORT_FAILED
                    : AnalysisState.FAILED;
        }
        if (stage == null) {
            return AnalysisState.INITIALIZE;
        }
        switch (stage) {
            case Stage.INITIALIZE:
                return (command == AnalysisCommand.ABORT) ? AnalysisState.ABORT : AnalysisState.INITIALIZE;
            case Stage.EXECUTE:
                return (command == AnalysisCommand.ABORT) ? AnalysisState.ABORT : AnalysisState.EXECUTE;
            case Stage.COMPLETED:
                return AnalysisState.COMPLETED;
            case Stage.ABORT:
                return AnalysisState.ABORT;
            case Stage.ABORTED:
                return AnalysisState.ABORTED;

        }
        return AnalysisState.UNKNOWN;
    }
}

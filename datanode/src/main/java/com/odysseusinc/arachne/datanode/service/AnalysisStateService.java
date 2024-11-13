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
import com.odysseusinc.arachne.datanode.repository.AnalysisStateJournalRepository;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class AnalysisStateService {
    @Autowired
    private AnalysisStateJournalRepository analysisStateJournalRepository;

    @Transactional
    public void handleStateFromEE(Analysis analysis, String stage, String error) {
        String reason = Optional.ofNullable(error).orElse("Update from Execution Engine");
        updateState(analysis, AnalysisCommand.UPDATE, stage, error, reason);
    }

    @Transactional
    public void updateState(Analysis analysis, AnalysisCommand command, String reason) {
        updateState(analysis, command, null, null, reason);
    }

    @Transactional
    public void updateState(Analysis analysis, AnalysisCommand command, String stage, String error, String reason) {
        AnalysisState state = toState(error, command, stage);
        Optional<AnalysisStateEntry> currentState = Optional.ofNullable(analysis.getCurrentState());
        Boolean hasChanged = currentState.map(s ->
                s.getState() != state
        ).orElse(true);
        if (hasChanged) {
            AnalysisStateEntry analysisStateEntry = new AnalysisStateEntry(
                    new Date(),
                    analysis, state,
                    ObjectUtils.defaultIfNull(command, currentState.map(AnalysisStateEntry::getCommand).orElse(null)), reason,
                    ObjectUtils.defaultIfNull(stage, currentState.map(AnalysisStateEntry::getStage).orElse(null)), error
            );
            analysisStateJournalRepository.save(analysisStateEntry);
            if (!currentState.isPresent()) {
                analysis.setInitialState(analysisStateEntry);
            }
            analysis.setCurrentState(analysisStateEntry);
            log.info("Analysis [{}] state updated to {} ({}), determined from command: '{}', stage: '{}', error: '{}'",
                    analysis.getId(), state.name(), reason, command, stage, error);
        } else if (Objects.equals(currentState.map(AnalysisStateEntry::getReason).orElse(null), reason)) {
            log.info("Analysis [{}] is already in state {} (new reason [{}])", analysis.getId(), command.name(), reason);
        }
    }

    private static AnalysisState toState(String error, AnalysisCommand command, String stage) {
        switch (command) {
            case CREATED:
                return AnalysisState.INITIALIZE;
            case EXECUTING:
                return AnalysisState.EXECUTE;
            case EXECUTION_FAILURE:
            case ABORT_FAILURE:
                return AnalysisState.FAILED;
            case ABORTING:
                return AnalysisState.ABORT;
            case UNAVAILABLE:
                return AnalysisState.DEAD;
            case UPDATE:
                if (StringUtils.isNotEmpty(error)) {
                    return AnalysisState.FAILED;
                } else if (Objects.equals(stage, Stage.ABORTED)) {
                    return AnalysisState.ABORTED;
                } else if (Objects.equals(stage, Stage.ABORT)) {
                    return AnalysisState.ABORT;
                } else if (Objects.equals(stage, Stage.COMPLETED)) {
                    return AnalysisState.COMPLETED;
                } else if (Objects.equals(stage, Stage.EXECUTE)) {
                    return AnalysisState.EXECUTE;
                } else if (Objects.equals(stage, Stage.INITIALIZE)) {
                    return AnalysisState.INITIALIZE;
                }
        }
        return AnalysisState.UNKNOWN;
    }
}

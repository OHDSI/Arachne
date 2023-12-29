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
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisState;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry;
import com.odysseusinc.arachne.datanode.repository.AnalysisStateJournalRepository;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.extern.slf4j.Slf4j;
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
        updateState(analysis, toState(error, stage), Optional.ofNullable(error).orElse("Update from Execution Engine"));
    }

    @Transactional
    public void updateState(Analysis analysis, AnalysisState state, String reason) {
        Optional<AnalysisStateEntry> entry = analysisStateJournalRepository.findLatestByAnalysisId(analysis.getId());
        AnalysisState current = entry.map(AnalysisStateEntry::getState).orElse(null);
        if (current != state) {
            AnalysisStateEntry analysisStateEntry = new AnalysisStateEntry(new Date(), state, reason, analysis);
            log.info("Analysis [{}] state updated to {} ({})", analysis.getId(), state.name(), reason);
            analysisStateJournalRepository.save(analysisStateEntry);
        } else if (Objects.equals(entry.map(AnalysisStateEntry::getReason).orElse(null), reason)) {
            log.info("Analysis [{}] is already in state {} (new reason [{}])", analysis.getId(), state.name(), reason);
        }
    }

    private static AnalysisState toState(String error, String stage) {
        if (Objects.equals(stage, Stage.ABORTED)) {
            return (error == null) ? AnalysisState.ABORTED : AnalysisState.ABORT_FAILURE;
        } else if (Objects.equals(stage, Stage.ABORT)) {
            return (error == null) ? AnalysisState.ABORTING : AnalysisState.ABORT_FAILURE;
        } else if (Objects.equals(stage, Stage.COMPLETED)) {
            return (error == null) ? AnalysisState.EXECUTED : AnalysisState.EXECUTION_FAILURE;
        } else if (Objects.equals(stage, Stage.EXECUTE) || Objects.equals(stage, Stage.INITIALIZE)) {
            return (error == null) ? AnalysisState.EXECUTING : AnalysisState.EXECUTION_FAILURE;
        } else {
            return AnalysisState.UNKNOWN;
        }
    }
}

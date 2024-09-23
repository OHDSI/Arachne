/*
 * Copyright 2024 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.engine;

import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptorService;
import com.odysseusinc.arachne.datanode.service.AnalysisService;
import com.odysseusinc.arachne.datanode.service.AnalysisStateService;
import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.ExecutionOutcome;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
public class ExecutionEngineSyncService {
    public static final String UNAVAILABLE = "UNAVAILABLE";

    @Autowired
    private ExecutionEngineClient engineClient;
    @Autowired
    private EngineStatusService engine;
    @Autowired
    private AnalysisService analysisService;
    @Autowired
    private AnalysisStateService analysisStateService;
    @Autowired
    private EnvironmentDescriptorService descriptorService;

    @Scheduled(fixedDelayString = "${executionEngine.status.period}")
    public void checkStatus() {
        Instant now = Instant.now();
        List<Long> incomplete = analysisService.getIncompleteIds();
        EngineStatus status;
        try {
            status = engineClient.status(incomplete);
            engine.update(now, null, () -> log.info("EE status: CONNECTED"));
        } catch (Exception e) {
            engine.update(now, e.getMessage(), () -> log.warn("EE status: [ERROR] ({})", e.getMessage()));
            return;
        }
        update(status, incomplete);
        descriptorService.updateDescriptors(status.getEnvironments());
    }

    private void update(EngineStatus engineStatus, List<Long> incomplete) {
        Map<Long, ExecutionOutcome> submissions = engineStatus.getSubmissions();
        incomplete.forEach(id -> {
            ExecutionOutcome status = submissions.get(id);
            analysisService.update(id, analysis -> {
                if (status != null) {
                    String error = status.getError();
                    String stage = status.getStage();
                    if (!Objects.equals(error, analysis.getError()) || !Objects.equals(stage, analysis.getStage())) {
                        // TODO stdout handling. The challenge is that any modification here will interfere with normal incremental writing.
                        //  So that normal writing will have to be changed as well.
                        analysis.setStage(stage);
                        analysisStateService.handleStateFromEE(analysis, stage, error);
                    }
                } else {
                    if (analysis.getStage() == null) {
                        AnalysisResultStatusDTO dbStatus = analysis.getStatus();
                        if (dbStatus == null) {
                            analysis.setStage(Stage.INITIALIZE);
                            analysisStateService.handleStateFromEE(analysis, Stage.INITIALIZE, UNAVAILABLE);
                        } else if (dbStatus == AnalysisResultStatusDTO.EXECUTED) {
                            analysis.setStage(Stage.COMPLETED);
                        } else if (dbStatus == AnalysisResultStatusDTO.FAILED) {
                            analysis.setStage(Stage.EXECUTE);
                            analysisStateService.handleStateFromEE(analysis, Stage.EXECUTE, "Failed");
                        }
                    } else {
                        analysisStateService.handleStateFromEE(analysis, analysis.getStage(), UNAVAILABLE);
                        analysis.setError(UNAVAILABLE);
                    }
                }
            });
        });
    }
}

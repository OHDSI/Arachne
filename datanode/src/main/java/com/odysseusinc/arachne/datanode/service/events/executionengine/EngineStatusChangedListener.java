/*
 * Copyright 2018, 2024 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.service.events.executionengine;

import com.odysseusinc.arachne.datanode.service.AnalysisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class EngineStatusChangedListener {
    private static final Logger logger = LoggerFactory.getLogger(EngineStatusChangedListener.class);
    private final AnalysisService analysisService;
    public EngineStatusChangedListener(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }
    @EventListener
    public void handleEngineStatusChanged(EngineStatusChangedEvent event) {
        try{
            switch (event.getEngineStatus ()){
                case OFFLINE:
                    analysisService.invalidateAllUnfinishedAnalyses(null);
                    break;
                case ONLINE:
                    analysisService.terminateAllOutdatedAnalyzes();
                    break;
            }
        }catch (Exception e) {
            logger.error("Error trying to {} the analysis. Error : {}",event.getEngineStatus().name(),e.getMessage());
        }
    }
}

/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.service.impl;

import com.odysseusinc.arachne.datanode.exception.ArachneSystemRuntimeException;
import com.odysseusinc.arachne.datanode.exception.ValidationException;
import com.odysseusinc.arachne.datanode.service.ExecutionEngineIntegrationService;
import com.odysseusinc.arachne.datanode.service.ExecutionEngineStatus;
import com.odysseusinc.arachne.datanode.service.client.engine.EngineClient;
import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.datanode.service.events.executionengine.EngineStatusChangedEvent;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.util.CommonFileUtils;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;

import static com.odysseusinc.arachne.datanode.service.ExecutionEngineStatus.OFFLINE;
import static com.odysseusinc.arachne.datanode.service.ExecutionEngineStatus.ONLINE;

@Service
public class ExecutionEngineIntegrationServiceImpl implements ExecutionEngineIntegrationService {
    private static final Logger logger = LoggerFactory.getLogger(ExecutionEngineIntegrationServiceImpl.class);
    private final ExecutionEngineClient engineClient;
    private final EngineClient engineStatusClient;
    private volatile ExecutionEngineStatus executionEngineStatus = OFFLINE;
    private final ApplicationEventPublisher eventPublisher;
    private final EngineStatusChangedEvent engineStatusChangedEvent = new EngineStatusChangedEvent(this);
    @Value("${analysis.file.maxsize}")
    protected Long maximumSize;

    @Autowired
    public ExecutionEngineIntegrationServiceImpl(ExecutionEngineClient engineClient, @Qualifier("engineStatusClient") EngineClient engineStatusClient, ApplicationEventPublisher eventPublisher) {
        this.engineClient = engineClient;
        this.engineStatusClient = engineStatusClient;
        this.eventPublisher = eventPublisher;
    }
    @Override
    public AnalysisRequestStatusDTO sendAnalysisRequest(
            AnalysisRequestDTO requestDTO, File analysisFolder, boolean compressedResult, boolean healthCheck
    ) {
        final File analysisTempDir = getTempDirectory("arachne_datanode_analysis_");
        try {
            final File archive = new File(analysisTempDir.toString(), "request.zip");
            CommonFileUtils.compressAndSplit(analysisFolder, archive, null);
            logger.info("Request [{}] with files for [{}], sending now", requestDTO.getId(), analysisFolder.getName());
            return engineClient.sendAnalysisRequest(requestDTO, archive, compressedResult, healthCheck);
        } catch (ResourceAccessException exception) {
            throw new ValidationException("Cannot establish connection to the execution engine");
        } catch (IOException zipException) {
            throw new ArachneSystemRuntimeException(zipException.getMessage());
        } finally {
            FileUtils.deleteQuietly(analysisTempDir);
        }
    }

    private File getTempDirectory(String prefix) {

        try {
            return Files.createTempDirectory(prefix).toFile();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    @Scheduled(fixedDelayString = "${executionEngine.status.period}")
    public void checkStatus() {
        try {
            engineStatusClient.checkStatus();
            
            if (OFFLINE.equals(this.executionEngineStatus)) {
                logger.info("Execution engine is online");
            }
            engineStatusChangedEvent.setEngineStatus(executionEngineStatus = ONLINE);
        } catch (Exception e) {
            if (ONLINE.equals(this.executionEngineStatus)) {
                logger.info("Execution engine is offline");
            }
            engineStatusChangedEvent.setEngineStatus(executionEngineStatus = OFFLINE);
        }
        eventPublisher.publishEvent(engineStatusChangedEvent);
    }

    @Override
    public ExecutionEngineStatus getExecutionEngineStatus() {
        return this.executionEngineStatus;
    }

    @Override
    public AnalysisResultDTO sendCancel(Long analysisId) {
        return engineClient.cancel(analysisId);
    }
}

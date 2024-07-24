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
import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.util.CommonFileUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;

@Slf4j
@Service
public class ExecutionEngineIntegrationServiceImpl implements ExecutionEngineIntegrationService {
    @Autowired
    private ExecutionEngineClient engineClient;

    @Override
    public AnalysisRequestStatusDTO sendAnalysisRequest(
            AnalysisRequestDTO requestDTO, File analysisFolder, boolean compressedResult, boolean healthCheck
    ) {
        final File analysisTempDir = getTempDirectory("arachne_datanode_analysis_");
        try {
            final File archive = new File(analysisTempDir.toString(), "request.zip");
            CommonFileUtils.compressAndSplit(analysisFolder, archive, null);
            log.info("Request [{}] with files for [{}], sending now", requestDTO.getId(), analysisFolder.getName());
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

    @Override
    public AnalysisResultDTO sendCancel(Long analysisId) {
        return engineClient.cancel(analysisId);
    }
}

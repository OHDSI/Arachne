/*
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
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

package com.odysseusinc.arachne.dockerrunner.api;

import com.odysseusinc.arachne.dockerrunner.execution.DockerExecutionService;
import com.odysseusinc.arachne.dockerrunner.execution.FileExtractor;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * REST API compatible with the full Execution Engine for analyze, abort, and status.
 * Data Node uses the same paths when calling this minimal runner.
 */
@RestController
@RequestMapping("/api/v1")
public class AnalysisController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AnalysisController.class);

    private final DockerExecutionService executionService;

    public AnalysisController(DockerExecutionService executionService) {
        this.executionService = executionService;
    }

    @Value("${analysis.dir:/tmp/docker-runner-executions}")
    private String analysisParentDir;

    @GetMapping(value = "/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public EngineStatus status(@RequestParam(value = "id", required = false) List<Long> ids) {
        return executionService.getStatus(ids);
    }

    @PostMapping(
            value = "/analyze",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public AnalysisRequestStatusDTO analyze(
            @RequestPart("analysisRequest") AnalysisRequestDTO analysisRequest,
            @RequestPart("file") List<MultipartFile> files,
            @RequestHeader(value = "arachne-compressed", defaultValue = "false") Boolean compressed,
            @RequestHeader(value = "arachne-waiting-compressed-result", defaultValue = "false") Boolean waitCompressedResult
    ) throws IOException {
        Long id = analysisRequest.getId();
        log.info("Request [{}] received for [{}]", id, analysisRequest.getResultCallback());
        File analysisDir = FileExtractor.extractFiles(files, analysisParentDir, Boolean.TRUE.equals(compressed));
        log.info("Request [{}] extracted to [{}]", id, analysisDir.getAbsolutePath());
        AnalysisRequestStatusDTO result = executionService.analyze(analysisRequest, analysisDir, Boolean.TRUE.equals(waitCompressedResult));
        log.info("Request [{}] accepted", id);
        return result;
    }

    @PostMapping(value = "/abort/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AnalysisResultDTO> abort(@PathVariable("id") Long analysisId) {
        return executionService.abort(analysisId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

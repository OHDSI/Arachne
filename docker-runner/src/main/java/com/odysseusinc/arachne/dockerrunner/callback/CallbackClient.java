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

package com.odysseusinc.arachne.dockerrunner.callback;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisExecutionStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.util.Collection;
import java.util.Date;

/**
 * Sends status updates and result callbacks to the Data Node (same contract as full EE).
 */
@Component
public class CallbackClient {

    private static final Logger log = LoggerFactory.getLogger(CallbackClient.class);
    private static final String PART_ANALYSIS_RESULT = "analysisResult";
    private static final String PART_FILE = "file";

    private final RestTemplate callbackRestTemplate;

    public CallbackClient(RestTemplate callbackRestTemplate) {
        this.callbackRestTemplate = callbackRestTemplate;
    }

    public void sendStatus(AnalysisRequestDTO request, String stage, String stdout) {
        Long id = request.getId();
        String url = expandUrl(request.getUpdateStatusCallback(), id, request.getCallbackPassword());
        log.debug("Execution [{}] sending status [{}]", id, stage);
        AnalysisExecutionStatusDTO status = new AnalysisExecutionStatusDTO(id, stage, stdout, new Date());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AnalysisExecutionStatusDTO> entity = new HttpEntity<>(status, headers);
        try {
            callbackRestTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        } catch (Exception e) {
            log.warn("Execution [{}] failed to send status to [{}]: {}", id, url, e.getMessage());
        }
    }

    public void sendResult(AnalysisRequestDTO request, AnalysisResultDTO result, Collection<File> resultFiles) {
        Long id = request.getId();
        String url = expandUrl(request.getResultCallback(), id, request.getCallbackPassword());
        log.info("Execution [{}] sending result stage=[{}] to [{}]", id, result.getStage(), url);
        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        HttpHeaders jsonHeaders = new HttpHeaders();
        jsonHeaders.setContentType(MediaType.APPLICATION_JSON);
        body.add(PART_ANALYSIS_RESULT, new HttpEntity<>(result, jsonHeaders));
        if (resultFiles != null) {
            for (File f : resultFiles) {
                body.add(PART_FILE, new FileSystemResource(f));
            }
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<LinkedMultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = callbackRestTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            log.info("Execution [{}] result sent, response {}", id, response.getStatusCode());
        } catch (Exception e) {
            log.error("Execution [{}] failed to send result to [{}]: {}", id, url, e.getMessage(), e);
        }
    }

    private static String expandUrl(String template, Long id, String password) {
        if (template == null) return null;
        return template
                .replace("{id}", String.valueOf(id))
                .replace("{password}", password != null ? password : "");
    }
}

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

package com.odysseusinc.arachne.datanode.service.analysis;

import com.odysseusinc.arachne.datanode.analysis.UploadDTO;
import com.odysseusinc.arachne.datanode.analysis.UploadService;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisCommand;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.AnalysisService;
import com.odysseusinc.arachne.datanode.service.AnalysisStateService;
import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.datanode.util.ZipUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Slf4j
@Service
public class AnalysisOrchestrator {
    @Autowired
    private AnalysisService service;
    @Autowired
    private UploadService uploadService;
    @Autowired
    private AnalysisStateService stateService;
    @Autowired
    private ExecutionEngineClient engine;

    public void cancel(Long id, User user) {
        service.ensureCancellable(id);
        stateService.updateState(id, AnalysisCommand.ABORT, "Cancelled by [" + user.getTitle() + "]", null);
        log.info("Analysis {} cancellation attempt to send to engine", id);
        engine.cancel(id).whenComplete((result, e) -> {
            if (e != null) {
                log.warn("Analysis {} failed to abort: {}: {}", id, e.getClass(), e.getMessage());
                log.debug(e.getMessage(), e);
                stateService.updateState(id, AnalysisCommand.ABORT, "Failed to complete termination command in Execution Engine", e.getMessage());
            } else {
                service.handleCancelSuccess(id, result);
            }
        });
    }

    public Long rerun(Long originalId, AnalysisRequestDTO request, User user) {
        return send(service.rerun(originalId, request, user), request.getTitle());
    }

    public Long run(AnalysisRequestDTO dto, User user, List<MultipartFile> files) {
        UploadDTO upload = uploadService.uploadFiles(user, files);
        return run(user, dto, upload.getName());
    }

    public Long run(User user, AnalysisRequestDTO request, String uploadId) {
        return send(service.run(user, request, uploadId), request.getTitle());
    }

    private Long send(Long id, String title) {
        Path path = service.preprocess(id);
        engine.sendAnalysisRequest(service.toEEDto(id), title, true, "request-" + id + ".zip", ZipUtils.zipDir(path)).handle((result, e) -> {
            if (e != null) {
                log.info("Request [{}] failed with [{}]: {}", id, e.getClass(), e.getMessage(), e);
                String reason = String.format("Execution engine request failed: %s", e.getMessage());
                stateService.updateState(id, reason, e.getMessage());
            } else {
                service.afterSend(id, result);
            }
            return id;
        });
        return id;
    }

}

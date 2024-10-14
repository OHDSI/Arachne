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

package com.odysseusinc.arachne.datanode.datasource;

import com.odysseusinc.arachne.datanode.Api;
import com.odysseusinc.arachne.datanode.controller.BaseController;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisExecutionStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.CompletableFuture;

@Slf4j
@RestController
@RequestMapping(CheckDataSourceCallbackController.PREFIX)
public class CheckDataSourceCallbackController extends BaseController {
    public static final String PREFIX = "/api/v1/data-sources/check";
    public static final String CHECK_RESULT = "/{id}/{password}/result";
    public static final String CHECK_UPDATE = "/{id}/{password}/update";
    @Autowired
    private CheckDataSourceService checkService;

    @PostMapping(value = CHECK_UPDATE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void status(
            @PathVariable Long id,
            @PathVariable String password,
            @RequestPart(Api.Part.ANALYSIS_RESULT) AnalysisExecutionStatusDTO result,
            @RequestPart(Api.Part.FILE) MultipartFile[] files
    ) {
        // TODO
        log.debug("Update status received for [{}]", id);
    }

    @Async
    @PostMapping(value = CHECK_RESULT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CompletableFuture<CheckResult> result(
            @PathVariable Long id,
            @PathVariable String password,
            @RequestPart(Api.Part.ANALYSIS_RESULT) AnalysisResultDTO result,
            @RequestPart(Api.Part.FILE) MultipartFile[] files
    ) {
        return checkService.saveResult(id, result, files);
    }

}

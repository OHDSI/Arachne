/*******************************************************************************
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
 *******************************************************************************/
package com.odysseusinc.arachne.datanode.service.client.engine;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public interface EngineClient {

    @RequestLine("POST /api/v1/analyze")
    @Headers({
            "Content-Type: " + MediaType.MULTIPART_FORM_DATA_VALUE,
            "arachne-compressed: true",
            "arachne-waiting-compressed-result: {compressed}",
            "arachne-datasource-check: {healthCheck}"
    })
    AnalysisRequestStatusDTO sendAnalysisRequest(@Param("analysisRequest") AnalysisRequestDTO analysisRequest,
                                                 @Param("file") MultipartFile file,
                                                 @Param("compressed") Boolean compressedResult,
                                                 @Param("healthCheck") Boolean healthCheck);

    @RequestLine("GET /api/v1/metrics")
    @Headers({
            "Content-Type: " + MediaType.TEXT_PLAIN_VALUE
    })
    String checkStatus();
}

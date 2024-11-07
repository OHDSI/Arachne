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

package com.odysseusinc.arachne.datanode.service.client.engine;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import org.apache.commons.io.function.IOConsumer;

import java.io.OutputStream;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ExecutionEngineClient {
    EngineStatus status(List<Long> ids);

    CompletableFuture<AnalysisResultDTO> cancel(long id);

    CompletableFuture<AnalysisRequestStatusDTO> sendAnalysisRequest(
            AnalysisRequestDTO analysisRequest, String analysisTitle, boolean compressedResult, String name, IOConsumer<OutputStream> bodyWriter
    );
}

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

package com.odysseusinc.arachne.ee;

import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus.Environments;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.ExecutionOutcome;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.function.IOConsumer;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Primary
@Service
public class StubExecutionEngineClient implements ExecutionEngineClient {

    private Instant started;
    private ConcurrentMap<Long, TestAnalysis> analyses;
    private Environments envs;

    public void init(Environments envs) {
        this.envs = envs;
        started = Instant.now();
        analyses = new ConcurrentHashMap<>();
    }

    @Override
    public CompletableFuture<AnalysisRequestStatusDTO> sendAnalysisRequest(
            AnalysisRequestDTO request, String title, boolean compressedResult, String name, IOConsumer<OutputStream> bodyWriter
    ) {
        CompletableFuture<AnalysisRequestStatusDTO> response = new CompletableFuture<>();
        getAnalyses().put(request.getId(), new TestAnalysis(title, request.getCallbackPassword(), toBytes(bodyWriter), response));
        return response;
    }

    @Override
    public EngineStatus status(List<Long> ids) {
        ConcurrentMap<Long, TestAnalysis> map = Optional.ofNullable(analyses).orElseGet(ConcurrentHashMap::new);
        Map<Long, ExecutionOutcome> statuses = ids.stream().flatMap(id ->
                Optional.ofNullable(map.get(id)).map(TestAnalysis::getOutcome).map(outcome ->
                        Stream.of(Pair.of(id, outcome))
                ).orElseGet(Stream::of)
        ).collect(Collectors.toMap(Pair::getKey, Pair::getValue));
        return new EngineStatus(started, statuses, envs);
    }

    @Override
    public CompletableFuture<AnalysisResultDTO> cancel(long id) {
        TestAnalysis analysis = getAnalyses().get(id);
        CompletableFuture<AnalysisResultDTO> response = new CompletableFuture<>();
        analysis.setCancelResponse(response);
        return response;
    }

    /**
     * Failing on null here forces reliable failure of a single run test of it doesn't initialize engine.
     * This dramatically lowers the chance of the cross-test contamination due to test author missing it.
     */
    public ConcurrentMap<Long, TestAnalysis> getAnalyses() {
        return Objects.requireNonNull(analyses, "Not initialized");
    }

    @SneakyThrows
    private byte[] toBytes(IOConsumer<OutputStream> bodyWriter) {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        bodyWriter.accept(bos);
        return bos.toByteArray();
    }

}

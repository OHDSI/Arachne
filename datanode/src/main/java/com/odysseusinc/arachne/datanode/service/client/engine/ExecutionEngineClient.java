/*
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
 */
package com.odysseusinc.arachne.datanode.service.client.engine;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.odysseusinc.arachne.datanode.service.client.ArachneHttpClientBuilder;
import com.odysseusinc.arachne.datanode.util.NoCloseOutputStream;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import dev.failsafe.RetryPolicy;
import dev.failsafe.okhttp.FailsafeCall;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Call;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okio.BufferedSink;
import org.apache.commons.io.function.IOConsumer;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.io.OutputStream;
import java.net.SocketTimeoutException;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@Slf4j
public class ExecutionEngineClient {

    private static final String EMPTY_FILENAME = "";
    public static final okhttp3.MediaType APPLICATION_JSON = okhttp3.MediaType.parse("application/json");
    private final OkHttpClient httpClient;
    private final EngineClientConfig properties;
    private final ObjectMapper objectMapper;

    public ExecutionEngineClient(
            ArachneHttpClientBuilder clientBuilder, EngineClientConfig properties, ObjectMapper objectMapper
    ) {
        this.properties = properties;
        this.httpClient = clientBuilder.buildOkHttpClient(properties.getProxyEnabledForEngine());
        this.objectMapper = objectMapper;
    }

    public EngineStatus status(List<Long> ids) {
        String url = buildUrl("/api/v1/status" + ids.stream().map(id -> "id=" + id).collect(Collectors.joining("&", "?", "")));
        Request request = new Request.Builder().get().url(url).build();
        Call call = httpClient.newCall(request);
        return executeRequest(url, FailsafeCall.with(noRetry()).compose(call), EngineStatus.class);
    }

    public AnalysisResultDTO cancel(long id) {
        String url = buildUrl("/api/v1/abort/" + id);
        // Yes, this is the weird way to make okhttp send empty body
        RequestBody body = RequestBody.create("", null);
        Request request = new Request.Builder().url(url).post(body).build();
        Call call = httpClient.newCall(request);
        FailsafeCall failsafeCall = FailsafeCall.with(retryPolicy()).compose(call);
        return executeRequest(url, failsafeCall, AnalysisResultDTO.class);
    }

    public AnalysisRequestStatusDTO sendAnalysisRequest(
            AnalysisRequestDTO analysisRequest, boolean compressedResult, String name, IOConsumer<OutputStream> bodyWriter
    ) {
        String json = toJson(analysisRequest);
        // ZipOutputStream must be auto-closed to finalize the archive, however underlying sink should
        // not be closed as okhttp might have more data to write in the same request
        OctetStreamRequestBody x = new OctetStreamRequestBody(sink ->
                bodyWriter.accept(new NoCloseOutputStream(sink.outputStream()))
        );
        MultipartBody body = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("analysisRequest", EMPTY_FILENAME, RequestBody.create(json, APPLICATION_JSON))
                .addFormDataPart("file", name, x)
                .build();
        String url = buildUrl(properties.getAnalysisUri());
        Request request = new Request.Builder()
                .url(url)
                .header("Content-Type", MediaType.MULTIPART_FORM_DATA_VALUE)
                .header("arachne-compressed", "true")
                .header("arachne-waiting-compressed-result", Boolean.toString(compressedResult))
                .post(body)
                .build();
        Call call = httpClient.newCall(request);
        FailsafeCall failsafeCall = FailsafeCall.with(retryPolicy()).compose(call);
        return executeRequest(url, failsafeCall, AnalysisRequestStatusDTO.class);
    }

    private <T> T executeRequest(String url, FailsafeCall call, Class<T> valueType) {
        try (Response response = call.execute()) {
            if (!response.isSuccessful()) {
                log.error("Failed to execute to [{}]. Response code: [{}]", url, response.code());
                throw new AnalysisExecutionException("Failed to request [" + url + ". Response code: " + response.code());
            }
            ResponseBody responseBody = response.body();
            if (responseBody != null && Objects.equals(responseBody.contentType(), APPLICATION_JSON)) {
                return objectMapper.readValue(responseBody.byteStream(), valueType);
            } else {
                String contentType = Optional.ofNullable(responseBody).map(ResponseBody::contentType).map(okhttp3.MediaType::type).orElse(null);
                log.error("Request to [{}] returned unsupported content type: [{}]", url, contentType);
                throw new AnalysisExecutionException("Unexpected response: " + contentType);
            }
        } catch (SocketTimeoutException e) {
            log.warn("Request to [{}] timed out: {}", url, e.getMessage());
            throw new AnalysisExecutionException("Failed to request [" + url + "]: " + e.getMessage(), e);
        } catch (IOException e) {
            log.debug("Request to [{}] failed: {}", url, e.getMessage(), e);
            throw new AnalysisExecutionException("Failed to request [" + url + "]: " + e.getMessage(), e);
        }
    }

    private String buildUrl(String suffix) {
        return String.format("%s://%s:%s%s", properties.getProtocol(), properties.getHost(), properties.getPort(), suffix);
    }

    private String toJson(AnalysisRequestDTO analysisRequest) {
        try {
            return objectMapper.writeValueAsString(analysisRequest);
        } catch (IOException e) {
            log.error("Failed to prepare analysis request", e);
            throw new AnalysisExecutionException("Failed to prepare analysis request: " + e.getMessage());
        }
    }

    private RetryPolicy<Response> noRetry() {
        return RetryPolicy.<Response>builder().withMaxAttempts(1).build();
    }

    private RetryPolicy<Response> retryPolicy() {
        return RetryPolicy.<Response>builder()
                .withMaxAttempts(2)
                .withBackoff(2, 4, ChronoUnit.SECONDS)
                .build();
    }

    private static class OctetStreamRequestBody extends RequestBody {
        private final IOConsumer<BufferedSink> consumer;

        public OctetStreamRequestBody(IOConsumer<BufferedSink> consumer) {
            this.consumer = consumer;
        }

        @Override
        public okhttp3.MediaType contentType() {
            return okhttp3.MediaType.parse(javax.ws.rs.core.MediaType.APPLICATION_OCTET_STREAM);
        }

        @Override
        public long contentLength() {
            return -1L;
        }

        @Override
        public void writeTo(@NotNull BufferedSink sink) throws IOException {
            consumer.accept(sink);
        }

    }
}

/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.odysseusinc.arachne.datanode.exception.ValidationException;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.service.ExecutionEngineIntegrationService;
import com.odysseusinc.arachne.datanode.service.ExecutionEngineIntegrationService.OctetStreamRequestBody;
import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.datanode.util.SqlUtils;
import com.odysseusinc.arachne.datanode.util.ZipUtils;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestTypeDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.DataSourceUnsecuredDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.extern.slf4j.Slf4j;
import org.ohdsi.sql.SqlTranslate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Arrays;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import static com.odysseusinc.arachne.datanode.Api.CHECK_RESULT;
import static com.odysseusinc.arachne.datanode.Api.CHECK_STATUS;
import static com.odysseusinc.arachne.datanode.Api.PREFIX;

@Slf4j
@Service
@Transactional
public class CheckDataSourceService {
    private static final String CDM_VERSION_FILENAME = "cdm_version.txt";
    private static final String SQL_FILENAME = "check-datasource.sql";

    private final Cache<Long, CompletableFuture<CheckResult>> results = CacheBuilder.newBuilder().expireAfterAccess(60, TimeUnit.MINUTES).build();

    @Autowired
    private ExecutionEngineIntegrationService engine;
    @Autowired
    private ExecutionEngineClient engineClient;

    @Autowired
    private DataSourceService service;

    @Value("${datanode.baseURL}")
    private String datanodeBaseURL;
    @Value("${datanode.port}")
    private String datanodePort;

    @Transactional
    public CompletableFuture<CheckResult> check(Long id) {
        DataSource dataSource = service.getById(id);
        return check(service.toUnsecuredDto(dataSource));
    }

    public CompletableFuture<CheckResult> check(DataSourceUnsecuredDTO dataSource) {
        log.info("Checking datasource [{}]", dataSource.getConnectionStringForLogging());

        Instant now = Instant.now();
        Long id = now.toEpochMilli();
        CompletableFuture<CheckResult> future = new CompletableFuture<>();
        results.put(id, future);

        AnalysisRequestDTO request = request(id, dataSource, now, datanodeBaseURL, datanodePort);

        String dbmsType = dataSource.getType().getOhdsiDB();
        String resultSchema = dataSource.getResultSchema();
        String sql = SqlUtils.translateSql(dbmsType, SqlTranslate.generateSessionId(), resultSchema, "select 1;");
        byte[] zip = ZipUtils.zipFile(SQL_FILENAME, sql.getBytes(StandardCharsets.UTF_8));

        try {
            OctetStreamRequestBody body = new OctetStreamRequestBody(sink -> sink.write(zip));
            AnalysisRequestStatusDTO status = engineClient.sendAnalysisRequest(request, false, "datasource-check-" + id, body);
            if (status.getType() == AnalysisRequestTypeDTO.NOT_RECOGNIZED) {
                future.completeExceptionally(new ValidationException("Check error: Execution not recognized"));
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            future.completeExceptionally(new ValidationException("Failed: " + e.getMessage()));
        }
        return future;
    }

    private static AnalysisRequestDTO request(Long id, DataSourceUnsecuredDTO dataSource, Instant now, String datanodeBaseURL, String datanodePort) {
        AnalysisRequestDTO request = new AnalysisRequestDTO();
        request.setId(id);
        request.setDataSource(dataSource);
        request.setExecutableFileName(SQL_FILENAME);
        request.setCallbackPassword(UUID.randomUUID().toString());
        request.setRequested(Date.from(now));
        request.setResultCallback(datanodeBaseURL + ":" + datanodePort + PREFIX + CHECK_RESULT);
        request.setUpdateStatusCallback(datanodeBaseURL + ":" + datanodePort + PREFIX + CHECK_STATUS);
        return request;
    }

    public CompletableFuture<CheckResult> saveResult(Long id, AnalysisResultDTO result, MultipartFile[] files) {
        CheckResult checkResult = Optional.ofNullable(result).filter(result1 ->
                Objects.equals(result.getStage(), Stage.COMPLETED)
        ).map(__ ->
                getCdmVersion(files).map(cdmVersion ->
                        CheckResult.of("CDM", cdmVersion)
                ).orElseGet(() ->
                        CheckResult.of("OTHER", null)
                )
        ).orElse(null);

        return Optional.ofNullable(results.getIfPresent(id)).map(found -> {
            found.complete(checkResult);
            return found;
        }).orElseGet(() -> CompletableFuture.completedFuture(checkResult));
    }

    private Optional<String> getCdmVersion(MultipartFile[] files) {
        return Arrays.stream(files).filter(file ->
                file.getOriginalFilename().equalsIgnoreCase(CDM_VERSION_FILENAME)
        ).map(this::getVersionFromFile).filter(Objects::nonNull).findAny();
    }

    private String getVersionFromFile(MultipartFile file) {

        try {
            Properties properties = new Properties();
            properties.load(file.getInputStream());
            return properties.getProperty("cdm_version");
        } catch (Exception ignored) {
            return null;
        }
    }

}

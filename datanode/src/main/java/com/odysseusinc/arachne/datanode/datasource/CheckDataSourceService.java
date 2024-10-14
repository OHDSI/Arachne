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
import com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType;
import com.odysseusinc.arachne.datanode.exception.ValidationException;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.service.ExecutionEngineIntegrationService;
import com.odysseusinc.arachne.datanode.util.SqlUtils;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestTypeDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.DataSourceUnsecuredDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
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

import static com.odysseusinc.arachne.datanode.datasource.CheckDataSourceCallbackController.CHECK_RESULT;
import static com.odysseusinc.arachne.datanode.datasource.CheckDataSourceCallbackController.CHECK_UPDATE;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultStatusDTO.EXECUTED;

@Slf4j
@Service
@Transactional
public class CheckDataSourceService {
    private static final String CDM_VERSION_FILENAME = "cdm_version.txt";

    private final Cache<Long, CompletableFuture<CheckResult>> results = CacheBuilder.newBuilder().expireAfterAccess(60, TimeUnit.MINUTES).build();

    @Autowired
    private ExecutionEngineIntegrationService engine;
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

    @Transactional
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
        byte[] sqlBytes = sql.getBytes(StandardCharsets.UTF_8);

        try {
            AnalysisRequestStatusDTO status = engine.sendArchive(request, "datasource-check-" + id, sqlBytes);
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
        request.setExecutableFileName("check_datasource.sql");
        request.setCallbackPassword(UUID.randomUUID().toString());
        request.setRequested(Date.from(now));
        request.setResultCallback(datanodeBaseURL + ":" + datanodePort + CHECK_RESULT);
        request.setUpdateStatusCallback(datanodeBaseURL + ":" + datanodePort + CHECK_UPDATE);
        return request;
    }

    public CompletableFuture<CheckResult> saveResult(Long id, AnalysisResultDTO analysisResult, MultipartFile[] files) {
        String cdmVersion = getCdmVersion(files, analysisResult);
        CommonModelType modelType = getModelType(cdmVersion, analysisResult);
        CheckResult result = CheckResult.of(modelType, cdmVersion);

        return Optional.ofNullable(results.getIfPresent(id)).map(found -> {
            found.complete(result);
            return found;
        }).orElseGet(() -> CompletableFuture.completedFuture(result));
    }

    private String getCdmVersion(MultipartFile[] files, AnalysisResultDTO analysisResult) {

        if (analysisResult == null || analysisResult.getStatus() != EXECUTED || ArrayUtils.isEmpty(files)) {
            return null;
        }

        return Arrays.stream(files)
                .filter(file -> file.getOriginalFilename().equalsIgnoreCase(CDM_VERSION_FILENAME))
                .map(this::getVersionFromFile)
                .filter(Objects::nonNull)
                .findAny().orElse(null);

    }

    private CommonModelType getModelType(String cdmVersion, AnalysisResultDTO analysisResult) {

        if (analysisResult == null || analysisResult.getStatus() != EXECUTED) {
            return null;
        }
        return cdmVersion == null ? CommonModelType.OTHER : CommonModelType.CDM;
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

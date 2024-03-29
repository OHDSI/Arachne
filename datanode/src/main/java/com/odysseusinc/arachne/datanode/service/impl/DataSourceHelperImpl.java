/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.service.impl;

import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.service.DataSourceHelper;
import com.odysseusinc.arachne.datanode.util.SqlUtils;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.ohdsi.sql.SqlTranslate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class DataSourceHelperImpl implements DataSourceHelper {

    public static final String FILE_FOR_PING_REQUEST = "test.sql";

    // SqlRender requires semicolon in the end of a query to do proper translation
    public static final String PING_REQUEST = "select 1;";
    private final GenericConversionService conversionService;

    private final String baseNodeUrl;

    @Autowired
    public DataSourceHelperImpl(
            GenericConversionService conversionService,
            @Value("${datanode.baseURL}") String datanodeBaseURL,
            @Value("${datanode.port}") String datanodePort
    ) {

        this.conversionService = conversionService;
        this.baseNodeUrl = String.format("%s:%s", datanodeBaseURL, datanodePort);
    }

    @Override
    public AnalysisRequestDTO prepareRequest(DataSource dataSource, Path tempDirectory, Long id, String callbackPath) throws IOException {

        if (StringUtils.isEmpty(callbackPath)) {
            throw new IllegalStateException("Callback path is not defined for ping query.");
        }
        addPingSqlScriptToTempDirectory(dataSource, tempDirectory);

        AnalysisRequestDTO requestDTO = conversionService.convert(dataSource, AnalysisRequestDTO.class);
        requestDTO.setResultCallback(String.format("%s%s", baseNodeUrl, callbackPath));
        requestDTO.setId(id);
        return requestDTO;
    }

    private void addPingSqlScriptToTempDirectory(DataSource dataSource, Path tempDirectory) throws IOException {
        if (dataSource == null || tempDirectory  == null) {
            throw new IllegalStateException("Cannot create sql script to ping data source.");
        }
        String pingSqlQuery = SqlUtils.translateSql(dataSource.getType().getOhdsiDB(), SqlTranslate.generateSessionId(), dataSource.getResultSchema(), PING_REQUEST);
        FileUtils.write(
                Paths.get(tempDirectory.toAbsolutePath().toString(), FILE_FOR_PING_REQUEST).toFile(),
                pingSqlQuery,
                Charset.defaultCharset());
    }
}

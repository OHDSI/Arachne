/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: Dec 11, 2017
 *
 */

package com.odysseusinc.arachne.datanode.service.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.odysseusinc.arachne.datanode.dto.atlas.CohortDefinition;
import com.odysseusinc.arachne.datanode.service.SqlRenderService;
import com.odysseusinc.arachne.datanode.service.client.atlas.AtlasClient;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

public abstract class BaseRequestHandler {
    protected final AtlasClient atlasClient;
    protected final SqlRenderService sqlRenderService;

    public BaseRequestHandler(SqlRenderService sqlRenderService, AtlasClient atlasClient) {

        this.sqlRenderService = sqlRenderService;
        this.atlasClient = atlasClient;
    }

    protected MultipartFile getAnalysisDescription(Map<String, Object> info) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        String result = mapper.writeValueAsString(info);
        return new MockMultipartFile("analysisDescription.json", result.getBytes());
    }

    protected MultipartFile getCohortFile(Integer cohortId, String name){

        return getCohortFile(cohortId, name, null, null);
    }

    protected MultipartFile getCohortFile(Integer cohortId, String name, String[] parameters, String[] values) {
         CohortDefinition cohort = atlasClient.getCohortDefinition(cohortId);
         if (Objects.nonNull(cohort)) {
             String content = sqlRenderService.renderSql(cohort);
             if (Objects.nonNull(content)) {
                 return new MockMultipartFile(name, content.getBytes());
             }
         }
         return null;
    }
}
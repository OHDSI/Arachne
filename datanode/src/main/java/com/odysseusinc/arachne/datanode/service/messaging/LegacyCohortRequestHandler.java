/**
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
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: July 26, 2017
 *
 */

package com.odysseusinc.arachne.datanode.service.messaging;

import static com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType.COHORT;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonCohortShortDTO;
import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.datanode.dto.atlas.CohortDefinition;
import com.odysseusinc.arachne.datanode.service.AtlasRequestHandler;
import com.odysseusinc.arachne.datanode.service.CommonEntityService;
import com.odysseusinc.arachne.datanode.service.client.atlas.AtlasClient;
import com.odysseusinc.arachne.datanode.service.client.portal.CentralSystemClient;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.ohdsi.circe.cohortdefinition.CohortExpression;
import org.ohdsi.circe.cohortdefinition.CohortExpressionQueryBuilder;
import org.ohdsi.sql.SqlRender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class LegacyCohortRequestHandler implements AtlasRequestHandler<CommonCohortShortDTO, MultipartFile> {

    private static final Logger LOGGER = LoggerFactory.getLogger(LegacyCohortRequestHandler.class);
    private final CentralSystemClient centralClient;
    private final AtlasClient atlasClient;
    private final GenericConversionService conversionService;
    private final CommonEntityService commonEntityService;
    private final CohortExpressionQueryBuilder queryBuilder;

    @Autowired
    public LegacyCohortRequestHandler(CentralSystemClient centralClient,
                                      AtlasClient atlasClient,
                                      GenericConversionService conversionService,
                                      CommonEntityService commonEntityService,
                                      CohortExpressionQueryBuilder queryBuilder) {

        this.centralClient = centralClient;
        this.atlasClient = atlasClient;
        this.conversionService = conversionService;
        this.commonEntityService = commonEntityService;
        this.queryBuilder = queryBuilder;
    }


    @Override
    public List<CommonCohortShortDTO> getObjectsList() {

        List<CohortDefinition> definitions = atlasClient.getCohortDefinitions();
        return definitions
                .stream()
                .map(cohort -> conversionService.convert(cohort, CommonCohortShortDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public MultipartFile getAtlasObject(String guid) {

        return commonEntityService.findByGuid(guid).map(entity -> {
            CohortDefinition definition = atlasClient.getCohortDefinition(entity.getLocalId());
            if (definition != null) {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    CohortExpression expression = mapper.readValue(definition.getExpression(), CohortExpression.class);
                    final CohortExpressionQueryBuilder.BuildExpressionQueryOptions options = new CohortExpressionQueryBuilder.BuildExpressionQueryOptions();
                    String expressionSql = queryBuilder.buildExpressionQuery(expression, options);
                    String content = SqlRender.renderSql(expressionSql, null, null);
                    return new MockMultipartFile(definition.getName().trim() + CommonFileUtils.OHDSI_SQL_EXT, content.getBytes());
                } catch (IOException e) {
                    LOGGER.error("Failed to construct cohort", e);
                }
            }
            return null;
        }).orElse(null);
    }

    @Override
    public CommonAnalysisType getAnalysisType() {

        return COHORT;
    }

    @Override
    public void sendResponse(MultipartFile response, String id) {

        MultipartFile[] files = new MultipartFile[]{ response };
        centralClient.sendCommonEntityResponse(id, files);
    }
}
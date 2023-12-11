/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: June 22, 2017
 *
 */

package com.odysseusinc.arachne.datanode.atlas;

import com.google.common.collect.Sets;
import com.google.common.io.Files;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonEntityDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonListEntityRequest;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonListEntityResponseDTO;
import com.odysseusinc.arachne.datanode.atlas.model.Atlas;
import com.odysseusinc.arachne.datanode.atlas.repository.AtlasRepository;
import com.odysseusinc.arachne.datanode.service.DataNodeService;
import com.odysseusinc.arachne.datanode.service.client.portal.CentralSystemClient;
import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class CohortService {
    public static final String IGNORE_PREPROCESSING_MARK = "-- @ohdsi-sql-ignore";
    private static final Logger LOGGER = LoggerFactory.getLogger(CohortService.class);

    private static final String CHECKING_COHORT_LISTS_REQUESTS_LOG = "Checking Cohort Lists Requests";
    private static final String CHECKING_COHORT_REQUESTS_LOG = "Checking Cohort Requests";
    private static final String PROCESS_LIST_REQUEST_FAILURE_LOG = "Process List Requests checking failure, {}";
    private static final String PROCESS_REQUEST_FAILURE_LOG = "Process request checking failure, {}";
    private final CentralSystemClient centralClient;
    private final ConfigurableListableBeanFactory beanFactory;
    private final AtlasRepository atlasRepository;
    private final DataNodeService dataNodeService;
    private Map<CommonAnalysisType,
            AtlasRequestHandler<? extends CommonEntityDTO, ? extends CommonEntityDTO>> handlerMap =
            new HashMap<>();

    public CohortService(CentralSystemClient centralClient,
                         ConfigurableListableBeanFactory beanFactory,
                         AtlasRepository atlasRepository,
                         DataNodeService dataNodeService) {

        this.centralClient = centralClient;
        this.beanFactory = beanFactory;
        this.atlasRepository = atlasRepository;
        this.dataNodeService = dataNodeService;
    }

    @PostConstruct
    public void init() {

        Map<String, AtlasRequestHandler> beans = beanFactory.getBeansOfType(AtlasRequestHandler.class);

        putBeans(beans, (v) -> !beanFactory.getBeanDefinition(v.getKey()).isPrimary());
        putBeans(beans, (v) -> beanFactory.getBeanDefinition(v.getKey()).isPrimary());

    }

    private void putBeans(Map<String, AtlasRequestHandler> beans, Predicate<? super Map.Entry<String, AtlasRequestHandler>> predicate) {

        beans.entrySet()
                .stream()
                .filter(predicate)
                .forEach(entry -> handlerMap.put(entry.getValue().getAnalysisType(), entry.getValue()));
    }

    public void checkListRequests() {

        LOGGER.debug(CHECKING_COHORT_LISTS_REQUESTS_LOG);
        try {

            if (!checkFunctionalMode()) {
                return;
            }

            final CommonListEntityRequest requests = centralClient.getEntityListRequests();
            if (CollectionUtils.isEmpty(requests.getRequestMap())) {
                return;
            }
            requests.getRequestMap().forEach((id, requestObject) -> {
                if (handlerMap.containsKey(requestObject.getEntityType())) {

                    LOGGER.info(
                            "Requesting entity list for type "
                                    + requestObject.getEntityType()
                                    + " for Atlas ids = "
                                    + requestObject.getAtlasIdList().stream().map(Object::toString).collect(Collectors.joining(", "))
                    );

                    List<Atlas> requestAtlasList = atlasRepository.findByCentralIdIn(requestObject.getAtlasIdList());
                    Map<Long, Long> atlasIdMap = requestAtlasList.stream().collect(Collectors.toMap(Atlas::getId, Atlas::getCentralId));

                    AtlasRequestHandler<? extends CommonEntityDTO, ? extends CommonEntityDTO> handler = handlerMap.get(requestObject.getEntityType());
                    List<? extends CommonEntityDTO> list = handler.getObjectsList(requestAtlasList);

                    list.forEach(entry -> entry.setOriginId(atlasIdMap.get(entry.getOriginId())));

                    CommonListEntityResponseDTO result =
                            new CommonListEntityResponseDTO(Sets.newHashSet(id), list);
                    centralClient.sendListEntityResponse(result);
                } else {
                    LOGGER.warn("Handler of type {} was not registered", requestObject.getEntityType());
                }
            });
        } catch (Exception ex) {
            LOGGER.error(PROCESS_LIST_REQUEST_FAILURE_LOG, ex.getMessage());
        }
    }

    public boolean isPreprocessingIgnored(File file) {

        try {
            String firstLine = Files.asCharSource(file, StandardCharsets.UTF_8).readFirstLine();
            return firstLine != null && firstLine.startsWith(IGNORE_PREPROCESSING_MARK);
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    public void checkCohortRequest() {

        LOGGER.debug(CHECKING_COHORT_REQUESTS_LOG);
        try {
            if (!checkFunctionalMode()) {
                return;
            }
            centralClient.getEntityRequests().forEach(request -> {
                if (handlerMap.containsKey(request.getEntityType())) {
                    AtlasRequestHandler handler = handlerMap.get(
                            request.getEntityType());
                    handler.sendResponse(
                            handler.getAtlasObject(request.getEntityGuid()),
                            request.getId()
                    );
                }
            });
        } catch (Exception ex) {
            if (LOGGER.isDebugEnabled()) {
                LOGGER.error(PROCESS_REQUEST_FAILURE_LOG, ex);
            } else {
                LOGGER.error(PROCESS_REQUEST_FAILURE_LOG, ex.getMessage());
            }
        }
    }

    private boolean checkFunctionalMode() {

        boolean isNetworkMode = dataNodeService.isNetworkMode();
        if (!isNetworkMode && LOGGER.isDebugEnabled()) {
            LOGGER.debug("DataNode is in \"{}\" mode, aborting request", dataNodeService.getDataNodeMode());
        }
        return isNetworkMode;
    }

}

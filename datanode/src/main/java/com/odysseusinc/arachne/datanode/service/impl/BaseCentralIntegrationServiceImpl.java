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
 * Created: September 25, 2017
 *
 */

package com.odysseusinc.arachne.datanode.service.impl;

import static org.apache.commons.lang3.StringUtils.isAnyBlank;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthMethodDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthenticationRequest;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataNodeRegisterDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataNodeRegisterResponseDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonLinkUserToDataNodeDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonProfessionalTypeDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonUserDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonUserRegistrationDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.datanode.Constants;
import com.odysseusinc.arachne.datanode.dto.user.CentralRegisterUserDTO;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.exception.IntegrationValidationException;
import com.odysseusinc.arachne.datanode.model.datanode.DataNode;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.BaseCentralIntegrationService;
import com.odysseusinc.arachne.datanode.util.CentralUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public abstract class BaseCentralIntegrationServiceImpl<DS extends DataSource, DTO extends CommonDataSourceDTO> implements BaseCentralIntegrationService<DS, DTO> {
    private static final Logger LOGGER = LoggerFactory.getLogger(CentralIntegrationServiceImpl.class);
    protected final RestTemplate centralRestTemplate;
    protected final GenericConversionService conversionService;
    protected final CentralUtil centralUtil;

    public BaseCentralIntegrationServiceImpl(GenericConversionService conversionService, @Qualifier("centralRestTemplate") RestTemplate centralRestTemplate, CentralUtil centralUtil) {

        this.conversionService = conversionService;
        this.centralRestTemplate = centralRestTemplate;
        this.centralUtil = centralUtil;
    }

    @Override
    public JsonResult<CommonAuthMethodDTO> getAuthMethod() {

        String url = centralUtil.getCentralUrl() + Constants.CentralApi.User.AUTH_METHOD;
        final ParameterizedTypeReference<JsonResult<CommonAuthMethodDTO>> parameterizedTypeReference
                = new ParameterizedTypeReference<JsonResult<CommonAuthMethodDTO>>() {
        };
        final ResponseEntity<JsonResult<CommonAuthMethodDTO>> exchange = centralRestTemplate.exchange(url, HttpMethod.GET, null, parameterizedTypeReference);
        return exchange.getBody();
    }

    @Override
    public DataNode sendDataNodeRegistrationRequest(User user, DataNode dataNode) {

        String url = centralUtil.getCentralUrl() + Constants.CentralApi.DataNode.REGISTRATION;
        return sendDataNodeRequestEntity(user, dataNode, url, HttpMethod.POST);
    }

    @Override
    public DataNode updateDataNodeOnCentral(User user, DataNode dataNode) {

        String url = centralUtil.getCentralUrl() + Constants.CentralApi.DataNode.UPDATE;
        return sendDataNodeRequestEntity(user, dataNode, url, HttpMethod.PUT, dataNode.getCentralId().toString());
    }

    private DataNode sendDataNodeRequestEntity(User user, DataNode dataNode, String url, HttpMethod method,
                                               String... uriVariables) {

        final CommonDataNodeRegisterDTO commonDataNodeRegisterDTO
                = conversionService.convert(dataNode, CommonDataNodeRegisterDTO.class);
        final HttpEntity<CommonDataNodeRegisterDTO> requestEntity
                = new HttpEntity<>(commonDataNodeRegisterDTO, centralUtil.getCentralAuthHeader(user.getToken()));
        final ParameterizedTypeReference<JsonResult<CommonDataNodeRegisterResponseDTO>> responseType
                = new ParameterizedTypeReference<JsonResult<CommonDataNodeRegisterResponseDTO>>() {
        };
        ResponseEntity<JsonResult<CommonDataNodeRegisterResponseDTO>> responseEntity
                = centralRestTemplate.exchange(url, method, requestEntity, responseType, uriVariables);
        JsonResult<CommonDataNodeRegisterResponseDTO> jsonResult = responseEntity.getBody();
        if (jsonResult != null && JsonResult.ErrorCode.VALIDATION_ERROR.getCode().equals(jsonResult.getErrorCode())) {
            throw new IntegrationValidationException(jsonResult);
        }
        if (jsonResult == null || !JsonResult.ErrorCode.NO_ERROR.getCode().equals(jsonResult.getErrorCode())
                && !JsonResult.ErrorCode.VALIDATION_ERROR.getCode().equals(jsonResult.getErrorCode())) {
            throw new IllegalStateException("Unable to register data node on central." + (jsonResult == null
                    ? "" : jsonResult.getErrorMessage()));
        }
        final CommonDataNodeRegisterResponseDTO commonDataNodeRegisterResponseDTO = jsonResult.getResult();
        final String nodeUuid = commonDataNodeRegisterResponseDTO.getDataNodeUuid();
        final String name = commonDataNodeRegisterResponseDTO.getName();
        final String description = commonDataNodeRegisterResponseDTO.getDescription();
        final String token = commonDataNodeRegisterResponseDTO.getToken();
        if (isAnyBlank(nodeUuid, name, description, token)) {
            throw new IllegalStateException("Unable to register data node on central. Topic names is blank or empty response");
        } else {
            dataNode.setCentralId(commonDataNodeRegisterResponseDTO.getCentralId());
            dataNode.setSid(nodeUuid);
            dataNode.setName(name);
            dataNode.setDescription(description);
            dataNode.setToken(token);
        }
        return dataNode;
    }

    @Override
    public JsonResult<CommonDataSourceDTO> sendDataSourceRegistrationRequest(
            User user, DataNode dataNode,
            DTO commonCreateDataSourceDTO) {

        String url = centralUtil.getCentralUrl() + Constants.CentralApi.DataSource.REGISTRATION;
        Map<String, Object> uriParams = new HashMap<>();
        uriParams.put("id", dataNode.getCentralId());
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(url);

        HttpEntity<DTO> requestEntity =
                new HttpEntity<>(commonCreateDataSourceDTO, centralUtil.getCentralAuthHeader(user.getToken()));
        ResponseEntity<JsonResult> exchange =
                centralRestTemplate.exchange(
                        uriBuilder.buildAndExpand(uriParams).toUri(),
                        HttpMethod.POST, requestEntity,
                        JsonResult.class);
        JsonResult<CommonDataSourceDTO> jsonResult = exchange.getBody();

        return jsonResult;
    }

    @Override
    public void registerUserOnCentral(CentralRegisterUserDTO registerUserDTO) {

        try {
            centralRestTemplate.exchange(
                    new URI(centralUtil.getCentralUrl()
                            + Constants.CentralApi.User.REGISTRATION),
                    HttpMethod.POST,
                    new HttpEntity(registerUserDTO), Object.class);
        } catch (URISyntaxException ex) {
            throw new AuthException("unable to register user on central " + ex.getMessage());
        }
    }

    @Override
    public String loginToCentral(String username, String password) {

        HttpEntity<CommonAuthenticationRequest> request = new HttpEntity<>(new CommonAuthenticationRequest(username, password));
        ResponseEntity<JsonResult> resultEntity =
                centralRestTemplate.postForEntity(
                        centralUtil.getCentralUrl() + Constants.CentralApi.User.LOGIN,
                        request,
                        JsonResult.class);
        JsonResult result = resultEntity.getBody();

        if (result == null) {
            throw new AuthException("Empty response body");
        }

        if (result.getErrorCode() != 0) {
            throw new AuthException(result.getErrorMessage());
        }

        if (result.getResult() == null) {
            throw new AuthException("Missing JWT token from central");
        }

        return ((Map) result.getResult()).get("token").toString();
    }

    @Override
    public JsonResult<CommonProfessionalTypeDTO> getProfessionalTypes() {

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("Content-Type", "application/json");
        HttpEntity request = new HttpEntity(headers);
        String url = centralUtil.getCentralUrl() + Constants.CentralApi.User.PROFESSIONAL_TYPES;
        ResponseEntity<JsonResult> exchange =
                centralRestTemplate.exchange(url, HttpMethod.GET, request, JsonResult.class);
        return (JsonResult<CommonProfessionalTypeDTO>) exchange.getBody();
    }

    @Override
    public JsonResult<CommonUserDTO> getRegisterUser(CommonUserRegistrationDTO dto) {

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("Content-Type", "application/json");
        HttpEntity request = new HttpEntity(dto, headers);
        String url = centralUtil.getCentralUrl() + Constants.CentralApi.User.REGISTER_USER;
        ResponseEntity<JsonResult> exchange = centralRestTemplate.exchange(
                url, HttpMethod.POST, request, JsonResult.class);
        return (JsonResult<CommonUserDTO>) exchange.getBody();
    }

    @Override
    public JsonResult<DTO> getDataSource(User user, Long id) {

        String url = centralUtil.getCentralUrl() + Constants.CentralApi.DataSource.GET;
        Map<String, Object> uriParams = new HashMap<>();
        uriParams.put("id", id);
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(url);

        HttpEntity request = new HttpEntity<>(centralUtil.getCentralAuthHeader(user.getToken()));

        ResponseEntity<JsonResult> exchange = centralRestTemplate.exchange(
                uriBuilder.buildAndExpand(uriParams).toUri(),
                HttpMethod.GET,
                request,
                JsonResult.class
        );
        return (JsonResult<DTO>) exchange.getBody();
    }

    @Override
    public JsonResult<DTO> updateDataSource(
            User user,
            DS dataSource, DTO commonCreateDataSourceDTO) {

        String url = centralUtil.getCentralUrl() + Constants.CentralApi.DataSource.UPDATE;
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(url);

        Map<String, Long> uriParams = new HashMap<>();
        uriParams.put("id", dataSource.getCentralId());

        HttpEntity<DTO> request = new HttpEntity<>(
                commonCreateDataSourceDTO,
                centralUtil.getCentralAuthHeader(user.getToken())
        );

        ResponseEntity<JsonResult> exchange = centralRestTemplate.exchange(
                uriBuilder.buildAndExpand(uriParams).toUri(),
                HttpMethod.PUT,
                request,
                JsonResult.class
        );
        return (JsonResult<DTO>) exchange.getBody();
    }

    @Override
    public JsonResult<List<CommonUserDTO>> suggestUsersFromCentral(
            User user,
            String query,
            Set<String> emails,
            int limit) {

        UriComponentsBuilder uriBuilder =
                UriComponentsBuilder.fromUriString(centralUtil.getCentralUrl()
                        + Constants.CentralApi.User.SUGGEST);
        uriBuilder.queryParam("query", query);
        uriBuilder.queryParam("limit", Integer.toString(limit));
        for (String email : emails) {
            uriBuilder.queryParam("email", email);
        }
        HttpEntity request = new HttpEntity<>(centralUtil.getCentralAuthHeader(user.getToken()));
        ParameterizedTypeReference<JsonResult<List<CommonUserDTO>>> responseType
                = new ParameterizedTypeReference<JsonResult<List<CommonUserDTO>>>() {
        };
        ResponseEntity<JsonResult<List<CommonUserDTO>>> exchange = centralRestTemplate.exchange(
                uriBuilder.buildAndExpand().toUri(),
                HttpMethod.GET, request, responseType);
        return exchange.getBody();
    }

    @Override
    public JsonResult<CommonUserDTO> getUserFromCentral(User user, Long centralUserId) {

        UriComponentsBuilder uriBuilder =
                UriComponentsBuilder.fromUriString(centralUtil.getCentralUrl()
                        + Constants.CentralApi.User.GET_USER);
        Map<String, String> uriParams = new HashMap<>();
        uriParams.put("id", centralUserId.toString());

        HttpEntity request = new HttpEntity<>(centralUtil.getCentralAuthHeader(user.getToken()));
        ParameterizedTypeReference<JsonResult<CommonUserDTO>> responseType
                = new ParameterizedTypeReference<JsonResult<CommonUserDTO>>() {
        };
        ResponseEntity<JsonResult<CommonUserDTO>> exchange = centralRestTemplate.exchange(
                uriBuilder.buildAndExpand(uriParams).toUri(),
                HttpMethod.GET, request, responseType);
        return exchange.getBody();
    }

    @Override
    public void linkUserToDataNodeOnCentral(DataNode dataNode, User user) {

        final HttpHeaders headers = centralUtil.getCentralNodeAuthHeader(dataNode.getToken());
        final CommonLinkUserToDataNodeDTO commonLinkUserToDataNode
                = conversionService.convert(user, CommonLinkUserToDataNodeDTO.class);
        final HttpEntity<CommonLinkUserToDataNodeDTO> httpEntity = new HttpEntity<>(commonLinkUserToDataNode, headers);
        linkUnlinkDataNodeUsers(dataNode.getCentralId(), httpEntity, HttpMethod.POST);
    }

    @Override
    public void unlinkUserToDataNodeOnCentral(DataNode dataNode, User user) {

        final HttpHeaders headers = centralUtil.getCentralNodeAuthHeader(dataNode.getToken());
        final CommonLinkUserToDataNodeDTO commonLinkUserToDataNode
                = conversionService.convert(user, CommonLinkUserToDataNodeDTO.class);
        final HttpEntity<CommonLinkUserToDataNodeDTO> httpEntity = new HttpEntity<>(commonLinkUserToDataNode, headers);
        linkUnlinkDataNodeUsers(dataNode.getCentralId(), httpEntity, HttpMethod.DELETE);
    }

    @Override
    public void relinkAllUsersToDataNodeOnCentral(DataNode dataNode, List<User> users) {

        final HttpHeaders headers = centralUtil.getCentralNodeAuthHeader(dataNode.getToken());
        final List<CommonLinkUserToDataNodeDTO> commonLinkUserToDataNodes = users.stream()
                .map(user -> conversionService.convert(user, CommonLinkUserToDataNodeDTO.class))
                .collect(Collectors.toList());
        final HttpEntity<List<CommonLinkUserToDataNodeDTO>> httpEntity
                = new HttpEntity<>(commonLinkUserToDataNodes, headers);
        linkUnlinkDataNodeUsers(dataNode.getCentralId(), httpEntity, HttpMethod.PUT);
    }

    private void linkUnlinkDataNodeUsers(Long datanodeId, HttpEntity httpEntity, HttpMethod method) {

        final String uri = centralUtil.getCentralUrl() + Constants.CentralApi.User.LINK_TO_NODE;
        final ResponseEntity<JsonResult> response = centralRestTemplate.exchange(
                uri,
                method,
                httpEntity,
                JsonResult.class,
                datanodeId
        );
        final JsonResult result = response.getBody();
        if (result.getErrorCode() != 0) {
            throw new IllegalStateException(result.getErrorMessage());
        }
    }

    protected void logoutFromCentral(String token) {

        try {
            centralRestTemplate.exchange(
                    new URI(centralUtil.getCentralUrl() + Constants.CentralApi.User.LOGOUT),
                    HttpMethod.GET, new HttpEntity(centralUtil.getCentralAuthHeader(token)), JsonResult.class);
        } catch (URISyntaxException ex) {
            throw new AuthException("unable to logout from central " + ex.getMessage());
        }
    }
}
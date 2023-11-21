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
 * Created: August 22, 2017
 *
 */

package com.odysseusinc.arachne.datanode.service.client.portal;

import com.odysseusinc.arachne.commons.api.v1.dto.ArachnePasswordInfoDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.AtlasShortDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAchillesGrantTypeDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAchillesPermissionDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAchillesReportDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthMethodDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthenticationRequest;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonBuildNumberDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonCountryDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataNodeCreationResponseDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataNodeDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonEntityRequestDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonLinkUserToDataNodeDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonListEntityRequest;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonListEntityResponseDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonProfessionalTypeDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonStateProvinceDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonUserDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonUserRegistrationDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.commons.types.SuggestionTarget;
import com.odysseusinc.arachne.datanode.Constants;
import com.odysseusinc.arachne.datanode.dto.user.CentralRegisterUserDTO;
import com.odysseusinc.arachne.datanode.dto.user.RemindPasswordDTO;
import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static com.odysseusinc.arachne.datanode.Constants.CentralApi.Achilles.LIST_PERMISSIONS;
import static com.odysseusinc.arachne.datanode.Constants.CentralApi.Achilles.LIST_REPORTS;
import static com.odysseusinc.arachne.datanode.Constants.CentralApi.Achilles.PERMISSION;
import static com.odysseusinc.arachne.datanode.Constants.CentralApi.DataNode.BUILD_NUMBER;
import static com.odysseusinc.arachne.datanode.Constants.CentralApi.User.LINK_TO_NODE;

@Configuration
public class CentralSystemClientDummyConfig {

    @Bean
    public CentralClient centralClient() {
        return new CentralClient() {
            @Override
            public JsonResult unpublishAndSoftDeleteDataSource(Long dataSourceId) {
                return null;
            }

            @Override
            public JsonResult<CommonAuthMethodDTO> getAuthMethod() {
                return null;
            }

            @Override
            public JsonResult<CommonDataNodeCreationResponseDTO> sendDataNodeCreationRequest() {
                return null;
            }

            @Override
            public ArachnePasswordInfoDTO getPasswordInfo() {
                return null;
            }

            @Override
            public void registerUser(CentralRegisterUserDTO userDTO) {

            }

            @Override
            public JsonResult login(CommonAuthenticationRequest authenticationRequest) {
                return null;
            }

            @Override
            public JsonResult logout() {
                return null;
            }

            @Override
            public JsonResult<List<CommonProfessionalTypeDTO>> getProfessionalTypes() {
                return null;
            }

            @Override
            public JsonResult<List<CommonCountryDTO>> getCountries(String query, Integer limit, Long includeId) {
                return null;
            }

            @Override
            public JsonResult<List<CommonStateProvinceDTO>> getStateProvinces(String countryId, String query, Integer limit, String includeId) {
                return null;
            }

            @Override
            public JsonResult<CommonUserDTO> registerUser(CommonUserRegistrationDTO userRegistration) {
                return null;
            }

            @Override
            public JsonResult<List<CommonDataSourceDTO>> getDataSources(String ids) {
                return null;
            }

            @Override
            public List<CommonUserDTO> suggestUsers(String query, SuggestionTarget target, Integer limit, String emails) {
                return null;
            }

            @Override
            public JsonResult<CommonUserDTO> getUser(String username) {
                return null;
            }

            @Override
            public <T extends CommonDataSourceDTO> JsonResult<T> createDataSource(Long dataNodeId, T dataSourceDTO) {
                return null;
            }

            @Override
            public <T extends CommonDataSourceDTO> JsonResult<T> updateDataSource(Long dataSourceId, T dataSource) {
                return null;
            }

            @Override
            public void remindPassword(RemindPasswordDTO userDTO) {

            }
        };
    }

    @Bean
    public CentralSystemClient centralSystemClient() {
        return new CentralSystemClient() {
            @Override
            public CommonListEntityRequest getEntityListRequests() {
                return null;
            }

            @Override
            public void sendListEntityResponse(CommonListEntityResponseDTO entityRequestResult) {

            }

            @Override
            public List<CommonEntityRequestDTO> getEntityRequests() {
                return Collections.emptyList();
            }

            @Override
            public void sendCommonEntityResponse(String id, MultipartFile[] files) {

            }

            @Override
            public void sendCommonEntityResponseEx(String id, MultipartFile[] files, Map<String, String> properties) {

            }

            @Override
            public AtlasShortDTO updateAtlasInfo(AtlasShortDTO atlasInfo) {
                return null;
            }

            @Override
            public void deleteAtlas(Long atlasId) {

            }

            @Override
            public void sendAchillesResults(Long centralId, MultipartFile file) {

            }

            @Override
            public JsonResult<CommonDataSourceDTO> getDataSource(String dataSourceUuid) {
                return null;
            }

            @Override
            public JsonResult<CommonDataNodeDTO> getDataNode(String dataNodeUuid) {
                return null;
            }

            @Override
            public <T extends CommonDataSourceDTO> JsonResult<T> getDataSource(Long dataSourceId) {
                return null;
            }

            @Override
            public List<CommonAchillesReportDTO> listReports() {
                return null;
            }

            @Override
            public List<CommonAchillesPermissionDTO> listPermissions(Long centralId) {
                return null;
            }

            @Override
            public CommonAchillesPermissionDTO getPermission(Long centralId, String reportId) {
                return null;
            }

            @Override
            public void setPermission(Long centralId, String reportId, CommonAchillesGrantTypeDTO grantType) {

            }

            @Override
            public void linkUser(Long centralId, CommonLinkUserToDataNodeDTO userLink) {

            }

            @Override
            public void unlinkUser(Long centralId, CommonLinkUserToDataNodeDTO userLink) {

            }

            @Override
            public JsonResult<List<CommonUserDTO>> relinkUsers(Long centralId, List<CommonLinkUserToDataNodeDTO> userLinks) {
                return null;
            }

            @Override
            public CommonBuildNumberDTO getBuildNumber() {
                return null;
            }
        };
    }
}

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
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: September 11, 2017
 *
 */

package com.odysseusinc.arachne.datanode.controller;

import static com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult.ErrorCode.NO_ERROR;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType;
import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.datanode.Constants;
import com.odysseusinc.arachne.datanode.dto.OptionDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.CreateDataSourceDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceBusinessDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceDTO;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.BaseCentralIntegrationService;
import com.odysseusinc.arachne.datanode.service.DataSourceService;
import com.odysseusinc.arachne.datanode.service.UserService;
import com.odysseusinc.arachne.datanode.service.client.portal.CentralClient;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.DBMSType;
import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.http.MediaType;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.support.destination.DestinationResolver;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

public abstract class BaseDataSourceController<DS extends DataSource, BusinessDTO extends DataSourceBusinessDTO, CommonDTO extends CommonDataSourceDTO> extends BaseController {

    protected final DataSourceService dataSourceService;
    protected final BaseCentralIntegrationService<DS, CommonDTO> integrationService;
    protected final ModelMapper modelMapper;
    protected final GenericConversionService conversionService;
    protected final JmsTemplate jmsTemplate;
    protected final DestinationResolver destinationResolver;
    protected final CentralClient centralClient;

    protected BaseDataSourceController(UserService userService,
                                       ModelMapper modelMapper,
                                       BaseCentralIntegrationService<DS, CommonDTO> integrationService,
                                       DataSourceService dataSourceService,
                                       GenericConversionService conversionService,
                                       CentralClient centralClient,
                                       JmsTemplate jmsTemplate) {

        super(userService);
        this.modelMapper = modelMapper;
        this.destinationResolver = jmsTemplate.getDestinationResolver();
        this.integrationService = integrationService;
        this.dataSourceService = dataSourceService;
        this.conversionService = conversionService;
        this.centralClient = centralClient;
        this.jmsTemplate = jmsTemplate;
    }

    @ApiOperation(value = "Add data source")
    @RequestMapping(value = Constants.Api.DataSource.ADD, method = RequestMethod.POST)
    public JsonResult<DataSourceDTO> add(Principal principal,
                                         @Valid @RequestBody CreateDataSourceDTO dataSourceDTO,
                                         BindingResult bindingResult
    ) throws NotExistException, PermissionDeniedException {

        if (bindingResult.hasErrors()) {
            return setValidationErrors(bindingResult);
        }
        final User user = getAdmin(principal);
        final DataSource dataSource = convertAndCheck(dataSourceDTO);

        DataSource optional = dataSourceService.create(user, dataSource).get();

        JsonResult<DataSourceDTO> result = new JsonResult<>(NO_ERROR);
        BusinessDTO businessDTO = conversionService.convert(optional, getDataSourceBusinessDTOClass());

        BusinessDTO dd = createOnCentral(principal, businessDTO.getId(), businessDTO).getResult();
        optional.setCentralId(dd.getId());
        dataSourceService.update(user, optional);
        result.setResult(modelMapper.map(optional, DataSourceDTO.class));
        return result;
    }

    protected DataSource convertAndCheck(CreateDataSourceDTO dataSourceDTO) {

        return conversionService.convert(dataSourceDTO, DataSource.class);
    }

    protected CommonModelType checkDataSource(DataSource dataSource) {

        return CommonModelType.CDM;
    }

    @ApiOperation(value = "Returns all data sources for current data node")
    @RequestMapping(
            value = Constants.Api.DataSource.ALL,
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public JsonResult<List<DataSourceDTO>> list(
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "sortAsc", required = false) Boolean sortAsc,
            Principal principal
    ) {

        if (principal == null) {
            throw new AuthException("user not found");
        }
        JsonResult<List<DataSourceDTO>> result = new JsonResult<>(NO_ERROR);
        List<DataSourceDTO> dtos = dataSourceService.findAll(sortBy, sortAsc).stream()
                .peek(this::masqueradePassword)
                .map(dataSource -> modelMapper.map(dataSource, DataSourceDTO.class))
                .collect(Collectors.toList());
        result.setResult(dtos);
        return result;
    }

    private DataSource masqueradePassword(DataSource dataSource){

        dataSource.setPassword(StringUtils.isEmpty(dataSource.getPassword()) ? "" : Constants.DUMMY_PASSWORD);
        return dataSource;
    }

    @ApiOperation(value = "Get data source")
    @RequestMapping(
            value = Constants.Api.DataSource.GET,
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public JsonResult<DataSourceDTO> get(Principal principal, @PathVariable("id") Long id) {

        if (principal == null) {
            throw new AuthException("user not found");
        }
        JsonResult<DataSourceDTO> result = new JsonResult<>(NO_ERROR);
        DataSource dataSource = dataSourceService.getById(id);
        result.setResult(modelMapper.map(masqueradePassword(dataSource), DataSourceDTO.class));
        return result;
    }

    @ApiOperation(value = "Removes data source from current data node")
    @RequestMapping(
            value = Constants.Api.DataSource.DELETE,
            method = RequestMethod.DELETE
    )
    public JsonResult<Boolean> delete(Principal principal, @PathVariable("id") Long id) {

        if (principal == null) {
            throw new AuthException("user not found");
        }
        JsonResult centralResult = unpublishAndDeleteOnCentral(id);
        JsonResult<Boolean> result = new JsonResult<>();
        result.setErrorCode(centralResult.getErrorCode());

        if (NO_ERROR.getCode().equals(centralResult.getErrorCode())) {
            dataSourceService.delete(id);
            result.setResult(Boolean.TRUE);
        } else {
            result.setResult(Boolean.FALSE);
        }
        return result;
    }

    @ApiOperation(value = "Updates given data source")
    @RequestMapping(
            value = Constants.Api.DataSource.UPDATE,
            method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public JsonResult<DataSourceDTO> update(Principal principal,
                                            @Valid @RequestBody CreateDataSourceDTO dataSourceDTO,
                                            @PathVariable("id") Long id,
                                            BindingResult bindingResult)
            throws PermissionDeniedException {

        if (bindingResult.hasErrors()) {
            return setValidationErrors(bindingResult);
        }
        final User user = getAdmin(principal);
        final DataSource dataSource = convertAndCheck(dataSourceDTO);
        dataSource.setId(id);
        final DataSource savedDataSource = dataSourceService.update(user, dataSource);

        final BusinessDTO dto = conversionService.convert(dataSource, getDataSourceBusinessDTOClass());
        dto.setModelType(checkDataSource(savedDataSource));
        updateOnCentral(principal, savedDataSource.getCentralId(), dto);

        return new JsonResult<>(NO_ERROR, modelMapper.map(masqueradePassword(savedDataSource), DataSourceDTO.class));
    }

    private JsonResult<BusinessDTO> createOnCentral(Principal principal,
                                                    Long id,
                                                    BusinessDTO dataSourceBusinessDTO) throws PermissionDeniedException {

        return processDataSource(principal, id, dataSourceBusinessDTO, (parameters) ->
                integrationService.sendDataSourceCreationRequest(
                        parameters.user,
                        parameters.dataSource.getDataNode(),
                        parameters.commonDTO
                ));
    }

    private JsonResult<BusinessDTO> updateOnCentral(Principal principal,
                                                    Long id,
                                                    BusinessDTO dataSourceBusinessDTO) throws PermissionDeniedException {
        return processDataSource(principal, id, dataSourceBusinessDTO, (parameters) -> {
            final JsonResult<CommonDTO> res = integrationService.sendDataSourceUpdateRequest(
                    parameters.user,
                    parameters.dataSource,
                    parameters.commonDTO
            );
            return res;
        });
    }

    public JsonResult unpublishAndDeleteOnCentral(Long dataSourceId) {

        DataSource dataSource = dataSourceService.getById(dataSourceId);
        return centralClient.unpublishAndSoftDeleteDataSource(dataSource.getCentralId());
    }

    protected abstract BusinessDTO enrichBusinessFromCommon(BusinessDTO businessDTO, CommonDTO commonDTO);

    @RequestMapping(
            value = "/api/v1/data-sources/dbms-types",
            method = RequestMethod.GET
    )
    public List<OptionDTO> getDBMSTypes() {

        return Arrays.stream(DBMSType.values())
                .map(dbms -> conversionService.convert(dbms, OptionDTO.class))
                .collect(Collectors.toList());
    }

    protected abstract Class<CommonDTO> getCommonDataSourceDTOClass();

    protected abstract Class<BusinessDTO> getDataSourceBusinessDTOClass();

    protected JsonResult<BusinessDTO> processDataSource(Principal principal,
                                                        Long id,
                                                        BusinessDTO dataSourceBusinessDTO,
                                                        Function<PortalInteractionParams, JsonResult<CommonDTO>> portalInteractionFunc
    ) throws PermissionDeniedException {

        final User user = getAdmin(principal);
        final DataSource dataSource = conversionService.convert(dataSourceBusinessDTO, DataSource.class);
        dataSource.setId(id);
        final DataSource updatedDataSource = dataSourceService.update(user, dataSource);
        dataSourceBusinessDTO.setUuid(updatedDataSource.getUuid());
        final CommonDTO commonDataSourceDTO
                = conversionService.convert(dataSourceBusinessDTO, getCommonDataSourceDTOClass());
        processBusinessDTO(updatedDataSource, commonDataSourceDTO);

        JsonResult<CommonDTO> centralJsonResult
                = portalInteractionFunc.apply(new PortalInteractionParams(user, updatedDataSource, commonDataSourceDTO));

        final BusinessDTO updatedDataSourceBusinessDTO
                = conversionService.convert(updatedDataSource, getDataSourceBusinessDTOClass());
        enrichBusinessFromCommon(updatedDataSourceBusinessDTO, centralJsonResult.getResult());
        final JsonResult<BusinessDTO> result = new JsonResult<>();
        result.setErrorCode(centralJsonResult.getErrorCode());
        result.setErrorMessage(centralJsonResult.getErrorMessage());
        result.setResult(updatedDataSourceBusinessDTO);
        result.setValidatorErrors(centralJsonResult.getValidatorErrors());
        return result;
    }

    private class PortalInteractionParams {
        private final User user;
        private final DataSource dataSource;
        private final CommonDTO commonDTO;

        public PortalInteractionParams(User user, DataSource dataSource, CommonDTO commonDTO) {

            this.user = user;
            this.dataSource = dataSource;
            this.commonDTO = commonDTO;
        }
    }

    protected void processBusinessDTO(DataSource dataSource, CommonDTO commonDataSourceDTO) {

        commonDataSourceDTO.setId(dataSource.getCentralId());
        commonDataSourceDTO.setUuid(dataSource.getUuid());
        commonDataSourceDTO.setModelType(CommonModelType.OTHER);
        commonDataSourceDTO.setOrganization("");
    }
}

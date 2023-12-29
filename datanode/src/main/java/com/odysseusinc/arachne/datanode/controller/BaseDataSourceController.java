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

package com.odysseusinc.arachne.datanode.controller;

import com.google.common.collect.ImmutableMap;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.OptionDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.commons.utils.ConverterUtils;
import com.odysseusinc.arachne.datanode.Constants;
import com.odysseusinc.arachne.datanode.dto.datasource.CreateDataSourceDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceBusinessDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceDTO;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.DataNodeService;
import com.odysseusinc.arachne.datanode.service.DataSourceService;
import com.odysseusinc.arachne.datanode.service.UserService;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import io.swagger.annotations.ApiOperation;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.http.MediaType;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.support.destination.DestinationResolver;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult.ErrorCode.NO_ERROR;

public abstract class BaseDataSourceController<DS extends DataSource, BusinessDTO extends DataSourceBusinessDTO, CommonDTO extends CommonDataSourceDTO> extends BaseController {

    private static final String COMMUNICATION_FAILED = "Failed to communicate with Central, error: {}";
    private static final String AUTH_ERROR_MESSAGE = "Couldn't autheticate on Central, {}";
    private static final String UNEXPECTED_ERROR = "Unexpected error during request to Central, {}";
    protected final DataSourceService dataSourceService;
    protected final ModelMapper modelMapper;
    protected final GenericConversionService conversionService;
    protected final JmsTemplate jmsTemplate;
    protected final DestinationResolver destinationResolver;
    protected final DataNodeService dataNodeService;
    protected final ConverterUtils converterUtils;
    private static final Logger LOGGER = LoggerFactory.getLogger(BaseDataSourceController.class);

    protected BaseDataSourceController(UserService userService,
                                       ModelMapper modelMapper,
                                       DataSourceService dataSourceService,
                                       GenericConversionService conversionService,
                                       JmsTemplate jmsTemplate,
                                       DataNodeService dataNodeService,
                                       ConverterUtils converterUtils) {

        super(userService);
        this.modelMapper = modelMapper;
        this.destinationResolver = jmsTemplate.getDestinationResolver();
        this.dataSourceService = dataSourceService;
        this.conversionService = conversionService;
        this.jmsTemplate = jmsTemplate;
        this.dataNodeService = dataNodeService;
        this.converterUtils = converterUtils;
    }

    @ApiOperation(value = "Add data source")
    @RequestMapping(value = Constants.Api.DataSource.ADD, method = RequestMethod.POST)
    public JsonResult<DataSourceDTO> add(Principal principal,
                                         @Valid @RequestPart("dataSource") CreateDataSourceDTO dataSourceDTO,
                                         @RequestPart(name = "keyfile", required = false) MultipartFile keyfile,
                                         BindingResult bindingResult
    ) throws NotExistException {

        return validatePersistDataSourceRequest(bindingResult, dataSourceDTO.getName(), null)
                .orElseGet(() -> saveDataSource(null, dataSourceDTO, principal, keyfile, dataSourceService::create));
    }

    @ApiOperation(value = "Updates given data source")
    @RequestMapping(
            value = Constants.Api.DataSource.UPDATE,
            method = RequestMethod.PUT
    )
    public JsonResult<DataSourceDTO> update(Principal principal,
                                            @Valid @RequestPart("dataSource") CreateDataSourceDTO dataSourceDTO,
                                            @PathVariable("id") Long id,
                                            @RequestPart(name = "keyfile", required = false) MultipartFile keyfile,
                                            BindingResult bindingResult)
            throws PermissionDeniedException {

        return validatePersistDataSourceRequest(bindingResult, dataSourceDTO.getName(), id)
                .orElseGet(() -> saveDataSource(id, dataSourceDTO, principal, keyfile, dataSourceService::update));
    }

    private JsonResult<DataSourceDTO> saveDataSource(Long dataSourceId, CreateDataSourceDTO dataSourceDTO, Principal principal, MultipartFile keyfile, BiFunction<User, DataSource, DataSource> persistDatasource) {

        final User user = getAdmin(principal);
        dataSourceDTO.setKeyfile(keyfile);
        DataSource dataSource = conversionService.convert(dataSourceDTO, DataSource.class);
        dataSource.setId(dataSourceId);

        DataSource persistedDataSource = persistDatasource.apply(user, dataSource);
        JsonResult<DataSourceDTO> result = new JsonResult<>(NO_ERROR);
        result.setResult(conversionService.convert(persistedDataSource, DataSourceDTO.class));
        return result;
    }

    private Optional<JsonResult<DataSourceDTO>> validatePersistDataSourceRequest(BindingResult bindingResult, String dataSourceName, Long dataSourceId) {

        if (bindingResult.hasErrors()) {
            return Optional.of(setValidationErrors(bindingResult));
        }

        if (!dataSourceService.isDatasourceNameUnique(dataSourceName, dataSourceId)) {
            JsonResult<DataSourceDTO> notUniqueNameResult = new JsonResult<>(JsonResult.ErrorCode.VALIDATION_ERROR);
            notUniqueNameResult.setValidatorErrors(ImmutableMap.of("name", "Data source name [" + dataSourceName + "] is not unique"));
            return Optional.of(notUniqueNameResult);
        }

        return Optional.empty();
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
    ) throws PermissionDeniedException {

        if (principal == null) {
            throw new AuthException("user not found");
        }
        JsonResult<List<DataSourceDTO>> result = new JsonResult<>(NO_ERROR);
        List<DataSourceDTO> dtos = dataSourceService.findAllNotDeleted(sortBy, sortAsc).stream()
                .map(dataSource -> conversionService.convert(dataSource, DataSourceDTO.class))
                .collect(Collectors.toList());

        result.setResult(dtos);
        return result;
    }

    @ApiOperation(value = "Get data source")
    @RequestMapping(
            value = Constants.Api.DataSource.GET,
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public JsonResult<DataSourceDTO> get(Principal principal, @PathVariable("id") Long id) throws PermissionDeniedException {

        if (principal == null) {
            throw new AuthException("user not found");
        }
        JsonResult<DataSourceDTO> result = new JsonResult<>(NO_ERROR);
        DataSource dataSource = dataSourceService.getById(id);
        DataSourceDTO resultDTO = conversionService.convert(dataSource, DataSourceDTO.class);
        result.setResult(resultDTO);
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
        JsonResult<Boolean> result = new JsonResult<>();
        dataSourceService.delete(id);
        result.setErrorCode(NO_ERROR.getCode());
        result.setResult(Boolean.TRUE);
        return result;
    }

    @ApiOperation("Remove kerberos keytab")
    @RequestMapping(
            value = Constants.Api.DataSource.DELETE_KEYTAB,
            method = RequestMethod.DELETE
    )
    public JsonResult removeKeytab(@PathVariable("id") Long id){

        DataSource dataSource = dataSourceService.getById(id);
        dataSourceService.removeKeytab(dataSource);
        return new JsonResult(NO_ERROR);
    }

    @ApiOperation("List supported DBMS")
    @RequestMapping(
            value = "/api/v1/data-sources/dbms-types",
            method = RequestMethod.GET
    )
    public List<OptionDTO> getDBMSTypes() {
        return Stream.of(DBMSType.values()).map(
                type -> new OptionDTO(type.getValue(), type.getLabel())
        ).collect(Collectors.toList());
    }

    @ApiOperation(value = "first check datasource result callback")
    @RequestMapping(value = Constants.Api.DataSource.DS_MODEL_CHECK_FIRSTCHECK,
            method = RequestMethod.POST,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void firstCheck(@PathVariable Long id,
                           @PathVariable String password,
                           @RequestPart("analysisResult") AnalysisResultDTO result,
                           @RequestPart("file") MultipartFile[] files) {
        dataSourceService.firstCheckCallbackProcess(id, password, result, files);
    }

}

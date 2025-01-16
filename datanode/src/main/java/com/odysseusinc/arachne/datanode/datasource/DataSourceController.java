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

import com.odysseusinc.arachne.commons.api.v1.dto.OptionDTO;
import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.WriteDataSourceDTO;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.UserService;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.DataSourceUnsecuredDTO;
import io.swagger.annotations.ApiOperation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/data-sources")
public class DataSourceController {
    @Autowired
    protected UserService userService;
    @Autowired
    private DataSourceService dataSourceService;
    @Autowired
    private CheckDataSourceService checkService;

    @SneakyThrows
    public static byte[] toBytes(MultipartFile file) {
        return file.getBytes();
    }

    @ApiOperation(value = "Add data source")
    @PostMapping
    public DataSourceDTO add(
            Principal principal,
            @Valid @RequestPart("dataSource") WriteDataSourceDTO dataSourceDTO,
            @RequestPart(name = "keyfile", required = false) MultipartFile keyfile
    ) throws NotExistException {
        User admin = getAdmin(principal);
        byte[] keyFile = Optional.ofNullable(keyfile).map(DataSourceController::toBytes).orElse(null);
        return dataSourceService.create(dataSourceDTO, admin, keyFile);
    }

    @ApiOperation(value = "Updates given data source")
    @PutMapping(value = "/{id}")
    public DataSourceDTO update(
            Principal principal,
            @Valid @RequestPart("dataSource") WriteDataSourceDTO dataSourceDTO,
            @PathVariable("id") Long id,
            @RequestPart(name = "keyfile", required = false) MultipartFile keyfile
    ) throws PermissionDeniedException {
        Optional<byte[]> keyFile = Optional.ofNullable(keyfile).map(DataSourceController::toBytes);
        User admin = getAdmin(principal);
        return dataSourceService.update(dataSourceDTO, id, admin, keyFile);
    }

    @ApiOperation(value = "Returns all data sources for current data node")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<DataSourceDTO> list(
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "sortAsc", required = false) Boolean sortAsc,
            Principal principal
    ) throws PermissionDeniedException {

        if (principal == null) {
            throw new AuthException("user not found");
        }
        List<DataSourceDTO> dtos = dataSourceService.findAllNotDeleted(sortBy, sortAsc).stream()
                .map(DataSourceService::toDto)
                .collect(Collectors.toList());
        return dtos;
    }

    @ApiOperation(value = "Get data source")
    @GetMapping(value = "/{id}")
    public DataSourceDTO get(Principal principal, @PathVariable("id") Long id) throws PermissionDeniedException {

        if (principal == null) {
            throw new AuthException("user not found");
        }
        DataSource dataSource = dataSourceService.getById(id);
        return DataSourceService.toDto(dataSource);
    }

    @ApiOperation(value = "Removes data source from current data node")
    @DeleteMapping("/{id}")
    public Boolean delete(Principal principal, @PathVariable("id") Long id) {
        if (principal == null) {
            throw new AuthException("user not found");
        }
        dataSourceService.delete(id);
        return true;
    }

    @ApiOperation("Remove kerberos keytab")
    @DeleteMapping("/{id}/keytab")
    public void removeKeytab(@PathVariable("id") Long id) {
        dataSourceService.removeKeytab(id);
    }

    @ApiOperation("List supported DBMS")
    @RequestMapping(
            value = "/dbms-types",
            method = RequestMethod.GET
    )
    public List<OptionDTO> getDBMSTypes() {
        return Stream.of(DBMSType.values()).map(
                type -> new OptionDTO(type.getValue(), type.getLabel())
        ).collect(Collectors.toList());
    }

    @Async
    @GetMapping(value = "/{id}/check")
    public CompletableFuture<CheckResult> check(@PathVariable Long id) {
        return checkService.check(id);
    }

    @Async
    @PostMapping(value = "/check")
    public CompletableFuture<CheckResult> check(DataSourceUnsecuredDTO dto) {
        return checkService.check(dto);
    }

    protected User getAdmin(Principal principal) throws PermissionDeniedException {
        User user = userService.getUser(principal);
        if (user.getRoles().stream().noneMatch(role -> role.getName().equalsIgnoreCase("ROLE_ADMIN"))) {
            throw new PermissionDeniedException("Access denied");
        }
        return user;
    }

}

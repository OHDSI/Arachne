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

package com.odysseusinc.arachne.datanode.dto.converters;

import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceDTO;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.util.DataSourceUtils;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.stereotype.Component;

@Component
public class DataSourceToDataSourceDTOConverter implements Converter<DataSource, DataSourceDTO> {

    @Autowired
    public DataSourceToDataSourceDTOConverter(GenericConversionService conversionService) {
        conversionService.addConverter(this);
    }

    @Override
    public DataSourceDTO convert(DataSource dataSource) {

        DataSourceDTO dto = new DataSourceDTO();
        dto.setId(dataSource.getId());
        dto.setName(dataSource.getName());
        dto.setCdmSchema(dataSource.getCdmSchema());
        dto.setConnectionString(dataSource.getConnectionString());
        dto.setDbmsType(dataSource.getType());
        dto.setDbUsername(dataSource.getUsername());
        dto.setDbPassword(dataSource.getPassword());
        dto.setDescription(dataSource.getDescription());
        dto.setUuid(dataSource.getUuid());
        dto.setCentralId(dataSource.getCentralId());

        dto.setResultSchema(dataSource.getResultSchema());
        dto.setTargetSchema(dataSource.getTargetSchema());
        dto.setCohortTargetTable(dataSource.getCohortTargetTable());

        dto.setHealthStatus(dataSource.getHealthStatus());
        dto.setHealthStatusDescription(dataSource.getHealthStatusDescription());

        dto.setUseKerberos(dataSource.getUseKerberos());
        dto.setKrbFQDN(dataSource.getKrbFQDN());
        dto.setKrbRealm(dataSource.getKrbRealm());
        dto.setKrbUser(dataSource.getKrbUser());
        dto.setHasKeytab(Objects.nonNull(dataSource.getKeyfile()));
        dto.setKrbPassword(dataSource.getKrbPassword());
        dto.setKrbAuthMechanism(dataSource.getKrbAuthMechanism());

        DataSourceUtils.masqueradePassword(dto);
        return dto;
    }
}

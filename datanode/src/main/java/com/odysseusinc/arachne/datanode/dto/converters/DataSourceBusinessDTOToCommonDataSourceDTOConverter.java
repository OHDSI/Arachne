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

import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceBusinessDTO;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.stereotype.Component;

@Component
public class DataSourceBusinessDTOToCommonDataSourceDTOConverter implements Converter<DataSourceBusinessDTO, CommonDataSourceDTO>, InitializingBean {

    private final GenericConversionService conversionService;

    public DataSourceBusinessDTOToCommonDataSourceDTOConverter(GenericConversionService conversionService) {

        this.conversionService = conversionService;
    }

    @Override
    public void afterPropertiesSet() throws Exception {

        conversionService.addConverter(this);
    }

    @Override
    public CommonDataSourceDTO convert(DataSourceBusinessDTO source) {

        final CommonDataSourceDTO commonDataSourceDTO = new CommonDataSourceDTO();

        commonDataSourceDTO.setModelType(source.getModelType());
        commonDataSourceDTO.setCdmVersion(source.getCdmVersion());
        commonDataSourceDTO.setId(source.getId());
        commonDataSourceDTO.setName(source.getName());
        commonDataSourceDTO.setAccessType(source.getAccessType());
        return commonDataSourceDTO;
    }
}

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
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.repository.DataSourceRepository;
import org.hibernate.Hibernate;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSourceDTOToDataSourceConverter implements Converter<CommonDataSourceDTO, DataSource> {

    private DataSourceRepository repository;

    public DataSourceDTOToDataSourceConverter(DataSourceRepository repository,
                                              GenericConversionService conversionService) {

        this.repository = repository;
        conversionService.addConverter(this);
    }

    @Override
    @Transactional
    public DataSource convert(CommonDataSourceDTO source) {

        DataSource dataSource = repository.getOne(source.getId());
        Hibernate.initialize(dataSource);
        return dataSource;
    }
}

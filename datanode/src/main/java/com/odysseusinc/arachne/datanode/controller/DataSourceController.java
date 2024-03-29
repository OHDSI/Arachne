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

import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceDTO;
import com.odysseusinc.arachne.commons.utils.ConverterUtils;
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceBusinessDTO;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.service.DataNodeService;
import com.odysseusinc.arachne.datanode.service.DataSourceService;
import com.odysseusinc.arachne.datanode.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataSourceController extends BaseDataSourceController<DataSource, DataSourceBusinessDTO, CommonDataSourceDTO> {

    @Autowired
    public DataSourceController(DataSourceService dataSourceService,
                                UserService userService,
                                ModelMapper modelMapper,
                                GenericConversionService conversionService,
                                JmsTemplate jmsTemplate,
                                DataNodeService dataNodeService,
                                ConverterUtils converterUtils) {

        super(userService,
                modelMapper,
                dataSourceService,
                conversionService,
                jmsTemplate,
                dataNodeService,
                converterUtils);
    }

}

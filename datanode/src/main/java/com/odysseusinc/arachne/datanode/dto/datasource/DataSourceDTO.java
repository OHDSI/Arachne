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

package com.odysseusinc.arachne.datanode.dto.datasource;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonHealthStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DataSourceDTO extends AbstractDataSourceDTO {
    private Long id;
    private String uuid;

    private Boolean published;
    private Boolean hasKeytab;

    private CommonHealthStatus healthStatus;
    private String healthStatusDescription;

}

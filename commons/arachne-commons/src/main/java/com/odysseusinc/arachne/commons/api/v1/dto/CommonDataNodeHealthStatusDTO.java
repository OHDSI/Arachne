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
 * Created: March 27, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import java.util.HashSet;
import java.util.Set;

public class CommonDataNodeHealthStatusDTO extends CommonHealthStatusResponseDTO {

    private Long centralId;
    private Set<CommonDataSourceHealthStatusDTO> dataSourceHealthStatuses = new HashSet<>();

    public Long getCentralId() {

        return centralId;
    }

    public void setCentralId(Long centralId) {

        this.centralId = centralId;
    }

    public Set<CommonDataSourceHealthStatusDTO> getDataSourceHealthStatuses() {

        return dataSourceHealthStatuses;
    }

    public void setDataSourceHealthStatuses(Set<CommonDataSourceHealthStatusDTO> dataSourceHealthStatuses) {

        this.dataSourceHealthStatuses = dataSourceHealthStatuses;
    }
}

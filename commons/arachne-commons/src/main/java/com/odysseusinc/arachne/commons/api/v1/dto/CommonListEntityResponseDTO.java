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
 * Created: July 19, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import java.util.List;
import java.util.Set;

public class CommonListEntityResponseDTO {
    private Set<String> requestIds;
    private List<? extends CommonEntityDTO> entities;

    public CommonListEntityResponseDTO() {

    }

    public CommonListEntityResponseDTO(Set<String> requestIds, List<? extends CommonEntityDTO> entities) {

        this.requestIds = requestIds;
        this.entities = entities;
    }

    public Set<String> getRequestIds() {

        return requestIds;
    }

    public void setRequestIds(Set<String> requestIds) {

        this.requestIds = requestIds;
    }

    public List<? extends CommonEntityDTO> getEntities() {

        return entities;
    }

    public void setEntities(List<? extends CommonEntityDTO> entities) {

        this.entities = entities;
    }
}

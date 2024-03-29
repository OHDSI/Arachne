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

package com.odysseusinc.arachne.commons.api.v1.dto;

import java.io.Serializable;
import java.util.Date;

public class CommonEntityDTO implements Serializable {

    private Long originId;
    private Long localId;

    private String guid;
    private String name;
    private String description;
    private Date modified;
    private CommonAnalysisType type;

    public String getGuid() {

        return guid;
    }

    public void setGuid(String guid) {

        this.guid = guid;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public Long getOriginId() {

        return originId;
    }

    public void setOriginId(Long originId) {

        this.originId = originId;
    }

    public Long getLocalId() {

        return localId;
    }

    public void setLocalId(Long localId) {

        this.localId = localId;
    }

    public String getDescription() {

        return description;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    public Date getModified() {

        return modified;
    }

    public void setModified(Date modified) {

        this.modified = modified;
    }

    public CommonAnalysisType getType() {

        return type;
    }

    public void setType(CommonAnalysisType type) {

        this.type = type;
    }
}

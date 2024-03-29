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

import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceAccessType;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.NotBlank;

public class DataSourceBusinessDTO {

    private Long id;

    @Pattern(
            message = "Must be valid UUID.",
            regexp = "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
    )
    @Deprecated
    private String uuid;

    @NotBlank
    private String name;
    @NotNull
    private CommonModelType modelType;

    private String cdmVersion;
    @NotNull
    private CommonDataSourceAccessType accessType;

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public String getUuid() {

        return uuid;
    }

    public void setUuid(String uuid) {

        this.uuid = uuid;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public CommonModelType getModelType() {

        return modelType;
    }

    public void setModelType(CommonModelType modelType) {

        this.modelType = modelType;
    }

    public String getCdmVersion() {
        return cdmVersion;
    }

    public void setCdmVersion(String cdmVersion) {
        this.cdmVersion = cdmVersion;
    }

    public CommonDataSourceAccessType getAccessType() {
        return accessType;
    }

    public void setAccessType(CommonDataSourceAccessType accessType) {
        this.accessType = accessType;
    }
}

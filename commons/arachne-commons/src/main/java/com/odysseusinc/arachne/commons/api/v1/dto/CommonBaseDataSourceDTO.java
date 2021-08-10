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
 * Created: January 20, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import com.odysseusinc.arachne.commons.api.v1.dto.util.NotNullIfAnotherFieldHasValue;
import com.odysseusinc.arachne.commons.types.CommonCDMVersionDTO;
import com.odysseusinc.arachne.commons.types.DBMSType;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

import static com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType.CDM_NAME;

@NotNullIfAnotherFieldHasValue(
        fieldName = "modelType",
        fieldValue = CDM_NAME,
        dependentFieldName = "cdmVersion",
        message = "CDM version should be detected")
public class CommonBaseDataSourceDTO implements Serializable {
    private Long id;

    private String uuid;

    @NotBlank
    private String name;
    @NotNull
    private CommonModelType modelType;

    private CommonCDMVersionDTO cdmVersion;

    private Boolean published;
    @NotNull
    private DBMSType dbmsType;
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

    public CommonCDMVersionDTO getCdmVersion() {
        return cdmVersion;
    }

    public void setCdmVersion(CommonCDMVersionDTO cdmVersion) {
        this.cdmVersion = cdmVersion;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public DBMSType getDbmsType() {
        return dbmsType;
    }

    public void setDbmsType(DBMSType dbmsType) {
        this.dbmsType = dbmsType;
    }

    public CommonDataSourceAccessType getAccessType() {
        return accessType;
    }

    public void setAccessType(CommonDataSourceAccessType accessType) {
        this.accessType = accessType;
    }
}

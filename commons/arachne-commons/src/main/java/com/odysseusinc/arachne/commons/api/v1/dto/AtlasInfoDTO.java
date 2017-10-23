/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 * Created: June 30, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import javax.validation.constraints.NotNull;

public class AtlasInfoDTO {

    public static final String ATLAS_VERSION_REGEX = "\\d\\.\\d\\.\\d(-plus)*";

    @NotNull
    private Boolean installed;

    private String version;

    public AtlasInfoDTO() {

    }

    public AtlasInfoDTO(Boolean installed, String version) {

        this.installed = installed;
        this.version = version;
    }

    public Boolean getInstalled() {

        return installed;
    }

    public void setInstalled(Boolean installed) {

        this.installed = installed;
    }

    public String getVersion() {

        return version;
    }

    public void setVersion(String version) {

        this.version = version;
    }
}

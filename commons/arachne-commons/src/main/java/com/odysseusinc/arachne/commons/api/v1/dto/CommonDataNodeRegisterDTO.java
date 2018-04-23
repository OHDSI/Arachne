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
 * Created: April 19, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotBlank;

public class CommonDataNodeRegisterDTO {

    private Long id;

    @NotBlank
    private String name;
    @NotBlank
    private String description;
    @NotNull
    private OrganizationDTO organization;

    public CommonDataNodeRegisterDTO() {

    }

    public CommonDataNodeRegisterDTO(String name, String description, OrganizationDTO organization) {

        this.name = name;
        this.description = description;
        this.organization = organization;
    }

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getDescription() {

        return description;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    public OrganizationDTO getOrganization() {

        return organization;
    }

    public void setOrganization(OrganizationDTO organization) {

        this.organization = organization;
    }
}

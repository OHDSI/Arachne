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

public class CommonDataNodeCreationResponseDTO implements Serializable {

    private String dataNodeUuid;
    private String token;
    private Long centralId;
    private OrganizationDTO organization;

    public String getDataNodeUuid() {

        return dataNodeUuid;
    }

    public void setDataNodeUuid(String dataNodeUuid) {

        this.dataNodeUuid = dataNodeUuid;
    }

    public String getToken() {

        return token;
    }

    public void setToken(String token) {

        this.token = token;
    }

    public Long getCentralId() {

        return centralId;
    }

    public void setCentralId(Long centralId) {

        this.centralId = centralId;
    }

    public OrganizationDTO getOrganization() {

        return organization;
    }

    public void setOrganization(OrganizationDTO organization) {

        this.organization = organization;
    }
}

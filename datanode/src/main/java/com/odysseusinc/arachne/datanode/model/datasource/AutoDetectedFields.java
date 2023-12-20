/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
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
 *******************************************************************************/
package com.odysseusinc.arachne.datanode.model.datasource;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceAccessType;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType;

public class AutoDetectedFields {

    private String cdmVersion;
    private CommonModelType commonModelType;
    private CommonDataSourceAccessType commonAccessType;

    public AutoDetectedFields() {
    }

    public AutoDetectedFields(CommonModelType commonModelType) {
        this.commonModelType = commonModelType;
    }

    public AutoDetectedFields(CommonModelType commonModelType, String cdmVersion, CommonDataSourceAccessType commonAccessType) {
        this.cdmVersion = cdmVersion;
        this.commonModelType = commonModelType;
        this.commonAccessType = commonAccessType;
    }

    public String getCdmVersion() {
        return cdmVersion;
    }

    public void setCdmVersion(String cdmVersion) {
        this.cdmVersion = cdmVersion;
    }

    public CommonModelType getCommonModelType() {
        return commonModelType;
    }

    public void setCommonModelType(CommonModelType commonModelType) {
        this.commonModelType = commonModelType;
    }

    public CommonDataSourceAccessType getCommonAccessType() {
        return commonAccessType;
    }

    public void setCommonAccessType(CommonDataSourceAccessType commonAccessType) {
        this.commonAccessType = commonAccessType;
    }
}

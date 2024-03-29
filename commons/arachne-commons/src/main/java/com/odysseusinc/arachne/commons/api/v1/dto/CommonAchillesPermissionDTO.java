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

public class CommonAchillesPermissionDTO {
    private CommonAchillesReportDTO report;
    private CommonAchillesGrantType grantType;
    private Long datasourceId;

    public CommonAchillesReportDTO getReport() {

        return report;
    }

    public void setReport(CommonAchillesReportDTO report) {

        this.report = report;
    }

    public CommonAchillesGrantType getGrantType() {

        return grantType;
    }

    public void setGrantType(CommonAchillesGrantType grantType) {

        this.grantType = grantType;
    }

    public Long getDatasourceId() {

        return datasourceId;
    }

    public void setDatasourceId(Long datasourceId) {

        this.datasourceId = datasourceId;
    }
}

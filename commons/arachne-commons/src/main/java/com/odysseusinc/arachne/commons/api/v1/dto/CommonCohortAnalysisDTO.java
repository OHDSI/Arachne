/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: July 07, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

public class CommonCohortAnalysisDTO extends CommonEntityDTO {

    private String design;
    private CommonCohortAnalysisType analysisType;

    private String comparatorUuid;
    private String targetUuid;
    private String outcomeUuid;
    private List<CommonCohortAnalysisFileDTO> files;

    @JsonRawValue
    public String getDesign() {

        return design;
    }

    public void setDesign(JsonNode data) {

        this.design = data.toString();
    }

    public void setDesign(String design) {

        this.design = design;
    }

    public CommonCohortAnalysisType getAnalysisType() {

        return analysisType;
    }

    public void setAnalysisType(CommonCohortAnalysisType analysisType) {

        this.analysisType = analysisType;
    }

    public String getComparatorUuid() {

        return comparatorUuid;
    }

    public void setComparatorUuid(String comparatorUuid) {

        this.comparatorUuid = comparatorUuid;
    }

    public String getTargetUuid() {

        return targetUuid;
    }

    public void setTargetUuid(String targetUuid) {

        this.targetUuid = targetUuid;
    }

    public String getOutcomeUuid() {

        return outcomeUuid;
    }

    public void setOutcomeUuid(String outcomeUuid) {

        this.outcomeUuid = outcomeUuid;
    }

    public List<CommonCohortAnalysisFileDTO> getFiles() {

        return files;
    }

    public void setFiles(List<CommonCohortAnalysisFileDTO> files) {

        this.files = files;
    }
}

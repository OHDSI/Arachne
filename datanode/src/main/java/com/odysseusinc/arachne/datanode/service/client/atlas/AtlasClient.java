/**
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
 * Created: June 27, 2017
 *
 */

package com.odysseusinc.arachne.datanode.service.client.atlas;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonCohortAnalysisDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonCohortDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonCohortShortDTO;
import com.odysseusinc.arachne.datanode.dto.atlas.CohortDefinition;
import com.odysseusinc.arachne.datanode.dto.atlas.ComparativeCohortAnalysis;
import com.odysseusinc.arachne.datanode.dto.atlas.ComparativeCohortAnalysisInfo;
import com.odysseusinc.arachne.datanode.dto.atlas.PatientLevelPredictionAnalysisInfo;
import com.odysseusinc.arachne.datanode.dto.atlas.PatientLevelPredictionInfo;
import feign.Param;
import feign.RequestLine;

import java.util.List;

public interface AtlasClient {

    @RequestLine("GET /exchange/cohorts")
    List<CommonCohortShortDTO> getAllCohorts();

    @RequestLine("GET /exchange/cohorts/{guid}")
    CommonCohortDTO getCohort(@Param("guid") String guid);

    @RequestLine("GET /info")
    Info getInfo();

    @RequestLine("GET /exchange/estimations")
    List<CommonCohortAnalysisDTO> getAllEstimations();

    @RequestLine("GET /exchange/estimations/{guid}")
    CommonCohortAnalysisDTO getEstimation(@Param("guid") String guid);

    @RequestLine("GET /cohortdefinition")
    List<CohortDefinition> getCohortDefinitions();

    @RequestLine("GET /cohortdefinition/{id}")
    CohortDefinition getCohortDefinition(@Param("id")  Integer id);

    @RequestLine("GET /comparativecohortanalysis")
    List<ComparativeCohortAnalysis> getComparativeCohortAnalyses();

    @RequestLine("GET /comparativecohortanalysis/{id}")
    ComparativeCohortAnalysisInfo getComparativeCohortAnalysisInfo(@Param("id") Integer id);

    @RequestLine("GET /plp")
    List<PatientLevelPredictionInfo> getPatientLevelPredictions();

    @RequestLine("GET /plp/{id}")
    PatientLevelPredictionAnalysisInfo getPatientLevelPrediction(@Param("id") Integer id);

    class Info {
        public String version;
    }
}

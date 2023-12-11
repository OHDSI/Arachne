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
 * Created: June 27, 2017
 *
 */

package com.odysseusinc.arachne.datanode.atlas.client;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonCohortAnalysisDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonCohortShortDTO;
import com.odysseusinc.arachne.datanode.atlas.AtlasConstants;
import com.odysseusinc.arachne.datanode.atlas.dto.CohortDefinition;
import com.odysseusinc.arachne.datanode.atlas.dto.IRAnalysis;
import com.odysseusinc.atlas.integration.CommonCohortDTO;
import feign.Param;
import feign.RequestLine;

import java.util.List;
import java.util.Map;

public interface AtlasClient {

    @RequestLine("GET /exchange/cohorts")
    List<CommonCohortShortDTO> getAllCohorts();

    @RequestLine("GET /exchange/cohorts/{guid}")
    CommonCohortDTO getCohort(@Param("guid") String guid);

    @RequestLine("GET /exchange/estimations")
    List<CommonCohortAnalysisDTO> getAllEstimations();

    @RequestLine("GET /exchange/estimations/{guid}")
    CommonCohortAnalysisDTO getEstimation(@Param("guid") String guid);

    @RequestLine("GET " + AtlasConstants.COHORT_DEFINITION)
    List<CohortDefinition> getCohortDefinitions();

    @RequestLine("GET /cohortdefinition/{id}")
    CohortDefinition getCohortDefinition(@Param("id")  Integer id);

    @RequestLine("GET /ir")
    List<IRAnalysis> getIncidenceRates();

    @RequestLine("GET /ir/{id}")
    Map<String, Object> getIncidenceRate(@Param("id") Integer localId);

    class Info {
        public String version;
    }
}

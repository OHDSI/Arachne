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
 * Created: August 08, 2017
 *
 */

package com.odysseusinc.arachne.commons.utils.cohortcharacterization;

public enum CohortCharacterizationDocType {

    DASHBOARD("dashboard"),
    PERSON("person"),
    OBSERVATION_PERIODS("observationperiods"),
    DATA_DENSITY("datadensity"),
    DEATH("death"),
    CONDITIONS("conditions"),
    CONDITIONERA("conditionera"),
    OBSERVATIONS("observations"),
    DRUGERA("drugeras"),
    DRUG("drugexposures"),
    DRUGSBYINDEX("drugbyindex"),
    PROCEDURES("procedures"),
    VISITS("visits"),
    ACHILLESHEEL("achillesheel"),
    COHORTPECIFIC("cohortspecific"),
    HERACLESHEEL("heraclesheel"),
    PROCEDURES_BY_INDEX("procbyindex"),
    CONDITIONS_BY_INDEX("condbyindex"),
    DATA_COMPLETENESS("datacompleteness"),
    ENTROPY("entropy"),
    UNKNOWN("unknown");

    private String title;

    CohortCharacterizationDocType(String title) {

        this.title = title;
    }

    public String getTitle() {

        return title;
    }
}

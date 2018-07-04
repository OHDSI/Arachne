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

import com.odysseusinc.arachne.commons.utils.JsonMatcher;

public class CohortCharacterizationMatcher extends JsonMatcher {

    private static final String COHORT_CHARACTERIZATION_EXT = ".json";

    {

        putToMap(CohortCharacterizationDocType.DASHBOARD.getTitle(), Dashboard.class);
        putToMap(CohortCharacterizationDocType.PERSON.getTitle(), Person.class);
        putToMap(CohortCharacterizationDocType.OBSERVATION_PERIODS.getTitle(), ObservationPeriods.class);
        putToMap(CohortCharacterizationDocType.DATA_DENSITY.getTitle(), DataDensity.class);
        putToMap(CohortCharacterizationDocType.DEATH.getTitle(), Death.class);
        putToMap(CohortCharacterizationDocType.CONDITIONS.getTitle(), Conditions.class);
        putToMap(CohortCharacterizationDocType.CONDITIONERA.getTitle(), ConditionEra.class);
        putToMap(CohortCharacterizationDocType.OBSERVATIONS.getTitle(), Observations.class);
        putToMap(CohortCharacterizationDocType.DRUGERA.getTitle(), Drugera.class);
        putToMap(CohortCharacterizationDocType.DRUG.getTitle(), Drug.class);
        putToMap(CohortCharacterizationDocType.DRUGSBYINDEX.getTitle(), DrugsByIndex.class);
        putToMap(CohortCharacterizationDocType.PROCEDURES.getTitle(), Procedures.class);
        putToMap(CohortCharacterizationDocType.VISITS.getTitle(), Visits.class);
        putToMap(CohortCharacterizationDocType.ACHILLESHEEL.getTitle(), AchillesHeel.class);
        putToMap(CohortCharacterizationDocType.COHORTPECIFIC.getTitle(), CohortSpecific.class);
        putToMap(CohortCharacterizationDocType.HERACLESHEEL.getTitle(), HeraclesHeel.class);
        putToMap(CohortCharacterizationDocType.PROCEDURES_BY_INDEX.getTitle(), ProceduresByIndex.class);
        putToMap(CohortCharacterizationDocType.CONDITIONS_BY_INDEX.getTitle(), ConditionsByIndex.class);
        putToMap(CohortCharacterizationDocType.DATA_COMPLETENESS.getTitle(), DataCompleteness.class);
        putToMap(CohortCharacterizationDocType.ENTROPY.getTitle(), Entropy.class);
    }

    @Override
    protected boolean satisfy(String fileName) {

        return fileName.endsWith(COHORT_CHARACTERIZATION_EXT);
    }
}

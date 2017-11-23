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
 * Created: August 08, 2017
 *
 */

package com.odysseusinc.arachne.commons.utils.cohortcharacterization;

import com.fasterxml.jackson.annotation.JsonProperty;

class Death extends CohortCharacterizationJson {

    private Types.Boxplot[] ageAtDeath;
    private Types.Donut[] deathByType;
    private Types.TrellisLine[] prevalenceByGenderAgeYear;
    private PrevalenceByMonth[] prevalenceByMonth;

    public Death(@JsonProperty(value = "ageAtDeath", required = true) Types.Boxplot[] ageAtDeath,
                 @JsonProperty(value = "deathByType", required = true) Types.Donut[] deathByType,
                 @JsonProperty(value = "prevalenceByGenderAgeYear", required = true) Types.TrellisLine[] prevalenceByGenderAgeYear,
                 @JsonProperty(value = "prevalenceByMonth", required = true) PrevalenceByMonth[] prevalenceByMonth) {

        this.ageAtDeath = ageAtDeath;
        this.deathByType = deathByType;
        this.prevalenceByGenderAgeYear = prevalenceByGenderAgeYear;
        this.prevalenceByMonth = prevalenceByMonth;
    }

    static class PrevalenceByMonth {
        public String X_CALENDAR_MONTH;
        public float Y_PREVALENCE_1000PP;
        public long CONCEPT_ID;
    }
}

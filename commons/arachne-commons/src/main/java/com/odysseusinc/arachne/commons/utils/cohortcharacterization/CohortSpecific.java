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

import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.Boxplot;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.LineDataByMonth;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.odysseusinc.arachne.commons.utils.CommonObjectJson;

class CohortSpecific extends CommonObjectJson {

    private PersonsByDurationFromStartToEnd[] personsByDurationFromStartToEnd;
    private PrevalenceByMonth[] prevalenceByMonth;
    private AgeAtIndexDistribution[] ageAtIndexDistribution;
    private Object[] distributionOfAgeAtCohortStartByCohortStartYear;
    private Boxplot[] distributionOfAgeAtCohortStartByGender;
    private LineDataByMonth[] personsInCohortFromCohortStartToEnd;
    private Object[] prevalenceByYearGenderSex;

    public CohortSpecific(@JsonProperty(value = "personsByDurationFromStartToEnd", required = true) PersonsByDurationFromStartToEnd[] personsByDurationFromStartToEnd,
                          @JsonProperty(value = "prevalenceByMonth", required = true) PrevalenceByMonth[] prevalenceByMonth,
                          @JsonProperty(value = "ageAtIndexDistribution", required = true) AgeAtIndexDistribution[] ageAtIndexDistribution,
                          @JsonProperty(value = "distributionOfAgeAtCohortStartByCohortStartYear", required = true) Object[] distributionOfAgeAtCohortStartByCohortStartYear,
                          @JsonProperty(value = "distributionOfAgeAtCohortStartByGender", required = true) Boxplot distributionOfAgeAtCohortStartByGender[],
                          @JsonProperty(value = "personsInCohortFromCohortStartToEnd", required = true) LineDataByMonth[] personsInCohortFromCohortStartToEnd,
                          @JsonProperty(value = "prevalenceByYearGenderSex", required = true) Object[] prevalenceByYearGenderSex) {

        this.personsByDurationFromStartToEnd = personsByDurationFromStartToEnd;
        this.prevalenceByMonth = prevalenceByMonth;
        this.ageAtIndexDistribution = ageAtIndexDistribution;
        this.distributionOfAgeAtCohortStartByCohortStartYear = distributionOfAgeAtCohortStartByCohortStartYear;
        this.distributionOfAgeAtCohortStartByGender = distributionOfAgeAtCohortStartByGender;
        this.personsInCohortFromCohortStartToEnd = personsInCohortFromCohortStartToEnd;
        this.prevalenceByYearGenderSex = prevalenceByYearGenderSex;
    }

    static class PersonsByDurationFromStartToEnd {
        public long COHORT_DEFINITION_ID;
        public long DURATION;
        public long COUNT_VALUE;
        public float PCT_PERSONS;
    }

    static class PrevalenceByMonth {
        public String X_CALENDAR_MONTH;
        public long NUM_PERSONS;
        public float Y_PREVALENCE_1000PP;
    }

    static class AgeAtIndexDistribution {
        public String CATEGORY;
        public float COUNT_VALUE;
        public float MIN_VALUE;
        public float MAX_VALUE;
        public float AVG_VALUE;
        public float STDEV_VALUE;
        public float P10_VALUE;
        public float P25_VALUE;
        public float MEDIAN_VALUE;
        public float P75_VALUE;
        public float P90_VALUE;
        public long CONCEPT_ID;
    }
}

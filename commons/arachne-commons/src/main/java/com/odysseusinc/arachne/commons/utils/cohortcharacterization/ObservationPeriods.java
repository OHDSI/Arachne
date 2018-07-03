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

import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.Boxplot;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.Donut;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.Line;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.LineData;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.LineDataByMonth;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.LineMetaData;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.odysseusinc.arachne.commons.utils.CommonObjectJson;

class ObservationPeriods extends CommonObjectJson {
    public final LineData[] ageAtFirst;
    public final LineData[] observationLengthData;
    public final LineMetaData[] observationLengthStats;
    public final LineData[] observedByYearData;
    public final LineMetaData[] observedByYearStats;
    public final Boxplot[] ageByGender;
    public final Boxplot[] observationLengthByGender;
    public final Boxplot[] observationLengthByAge;
    public final Line[] cumulativeDuration;
    public final LineDataByMonth[] observedByMonth;
    public final Donut[] periodPerPerson;

    ObservationPeriods(@JsonProperty(value = "ageAtFirst", required = true) LineData[] ageAtFirst,
                       @JsonProperty(value = "observationLengthData", required = true) LineData[] observationLengthData,
                       @JsonProperty(value = "observationLengthStats", required = true) LineMetaData[] observationLengthStats,
                       @JsonProperty(value = "observedByYearData", required = true) LineData[] observedByYearData,
                       @JsonProperty(value = "observedByYearStats", required = true) LineMetaData[] observedByYearStats,
                       @JsonProperty(value = "ageByGender", required = true) Boxplot[] ageByGender,
                       @JsonProperty(value = "observationLengthByGender", required = true) Boxplot[] observationLengthByGender,
                       @JsonProperty(value = "observationLengthByAge", required = true) Boxplot[] observationLengthByAge,
                       @JsonProperty(value = "cumulativeDuration", required = true) Line[] cumulativeDuration,
                       @JsonProperty(value = "observedByMonth", required = true) LineDataByMonth[] observedByMonth,
                       @JsonProperty(value = "periodPerPerson", required = true) Donut[] periodPerPerson) {

        this.ageAtFirst = ageAtFirst;
        this.observationLengthData = observationLengthData;
        this.observationLengthStats = observationLengthStats;
        this.observedByYearData = observedByYearData;
        this.observedByYearStats = observedByYearStats;
        this.ageByGender = ageByGender;
        this.observationLengthByGender = observationLengthByGender;
        this.observationLengthByAge = observationLengthByAge;
        this.cumulativeDuration = cumulativeDuration;
        this.observedByMonth = observedByMonth;
        this.periodPerPerson = periodPerPerson;
    }
}

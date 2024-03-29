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

package com.odysseusinc.arachne.commons.utils.cohortcharacterization;

import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.Donut;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.Line;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.LineData;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.LineDataByMonth;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.odysseusinc.arachne.commons.utils.CommonObjectJson;

class Dashboard extends CommonObjectJson {
    public LineData[] ageAtDeath;
    public Donut[] gender;
    public Line[] cumulativeDuration;
    public LineDataByMonth[] observedByMonth;

    public Dashboard(@JsonProperty(value = "ageAtDeath", required = true) LineData[] ageAtDeath,
                     @JsonProperty(value = "gender", required = true) Donut[] gender,
                     @JsonProperty(value = "cumulativeDuration", required = true) Line[] cumulativeDuration,
                     @JsonProperty(value = "observedByMonth", required = true) LineDataByMonth[] observedByMonth) {

        this.ageAtDeath = ageAtDeath;
        this.gender = gender;
        this.cumulativeDuration = cumulativeDuration;
        this.observedByMonth = observedByMonth;
    }
}

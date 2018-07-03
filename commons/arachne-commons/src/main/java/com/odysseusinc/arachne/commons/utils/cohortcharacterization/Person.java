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

import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.Donut;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.LineData;
import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.LineMetaData;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.odysseusinc.arachne.commons.utils.CommonObjectJson;

class Person extends CommonObjectJson {
    public LineData[] yearOfBirthData;
    public LineMetaData[] yearOfBirthStats;
    public Donut[] gender;
    public Donut[] race;
    public Donut[] ethnicity;

    public Person(@JsonProperty(value = "yearOfBirthData", required = true) LineData[] yearOfBirthData,
                  @JsonProperty(value = "yearOfBirthStats", required = true) LineMetaData[] yearOfBirthStats,
                  @JsonProperty(value = "gender", required = true) Donut[] gender,
                  @JsonProperty(value = "race", required = true) Donut[] race,
                  @JsonProperty(value = "ethnicity", required = true) Donut[] ethnicity) {

        this.yearOfBirthData = yearOfBirthData;
        this.yearOfBirthStats = yearOfBirthStats;
        this.gender = gender;
        this.race = race;
        this.ethnicity = ethnicity;
    }
}

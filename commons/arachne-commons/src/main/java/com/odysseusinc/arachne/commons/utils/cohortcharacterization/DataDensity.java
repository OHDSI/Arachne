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

import static com.odysseusinc.arachne.commons.utils.cohortcharacterization.Types.Boxplot;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.odysseusinc.arachne.commons.utils.CommonObjectJson;

class DataDensity extends CommonObjectJson {

    private Object[] recordsPerPerson;
    private Object [] totalRecords;
    private Boxplot[] conceptsPerPerson;

    public DataDensity(@JsonProperty(value = "recordsPerPerson", required = true) Object[] recordsPerPerson,
                       @JsonProperty(value = "totalRecords", required = true) Object[] totalRecords,
                       @JsonProperty(value = "conceptsPerPerson", required = true) Boxplot[] conceptsPerPerson) {

        this.recordsPerPerson = recordsPerPerson;
        this.totalRecords = totalRecords;
        this.conceptsPerPerson = conceptsPerPerson;
    }

}

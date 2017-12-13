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
import com.odysseusinc.arachne.commons.utils.CommonObjectJson;

class DrugsByIndex extends CommonObjectJson {

    private DrugEraPrevalenceOfDrug[] drugEraPrevalenceOfDrug;

    public DrugsByIndex(@JsonProperty(value = "drugEraPrevalenceOfDrug", required = true) DrugEraPrevalenceOfDrug[] drugEraPrevalenceOfDrug) {

        this.drugEraPrevalenceOfDrug = drugEraPrevalenceOfDrug;
    }

    static class DrugEraPrevalenceOfDrug {
        public long CONCEPT_ID;
        public String INGREDIENT_CONCEPT_NAME;
        public String ATC5_CONCEPT_NAME;
        public String ATC3_CONCEPT_NAME;
        public String ATC1_CONCEPT_NAME;
        public String CONCEPT_PATH;
        public float PERCENT_PERSONS;
        public float PERCENT_PERSONS_BEFORE;
        public float PERCENT_PERSONS_AFTER;
        public float RISK_DIFF_AFTER_BEFORE;
        public float LOGRR_AFTER_BEFORE;
        public long NUM_PERSONS;
        public long COUNT_VALUE;
    }
}

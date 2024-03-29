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

import com.fasterxml.jackson.annotation.JsonProperty;
import com.odysseusinc.arachne.commons.utils.CommonObjectJson;

class ConditionsByIndex extends CommonObjectJson {

    private ConditionOccurrencePrevalenceOfCondition[] conditionOccurrencePrevalenceOfCondition;

    public ConditionsByIndex(@JsonProperty(value = "conditionOccurrencePrevalenceOfCondition", required = true) ConditionOccurrencePrevalenceOfCondition[] conditionOccurrencePrevalenceOfCondition) {

        this.conditionOccurrencePrevalenceOfCondition = conditionOccurrencePrevalenceOfCondition;
    }

    static class ConditionOccurrencePrevalenceOfCondition {
        public long CONCEPT_ID;
        public String SOC_CONCEPT_NAME;
        public String HLGT_CONCEPT_NAME;
        public String HLT_CONCEPT_NAME;
        public String PT_CONCEPT_NAME;
        public String CONCEPT_NAME;
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

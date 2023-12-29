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
package com.odysseusinc.arachne.commons.utils.cohort;

public class Types {
    static class ConceptSet {

    }

    static class Criteria{

    }

    static class Limit {
        public String Type;
    }

    static class Rule {

    }

    static class Settings {
        public String CollapseType;
        public Integer EraPad;
    }

    static class CriteriaGroup {
        public String Type;
        public Integer Count;
        public CorelatedCriteria[] CriteriaList;
        public DemographicCriteria[] DemographicCriteriaList;
        public CriteriaGroup[] Groups;
    }

    public class CorelatedCriteria {
        public Criteria Criteria;
        public Object StartWindow;
        public Object EndWindow;
        public Object Occurrence;
        public boolean RestrictVisit;
    }

    public class DemographicCriteria {
        public Object Age;
        public Object[] Gender;
        public Object[] Race;
        public Object[] Ethnicity;
        public Object OccurrenceStartDate;
        public Object OccurrenceEndDate;
    }
}

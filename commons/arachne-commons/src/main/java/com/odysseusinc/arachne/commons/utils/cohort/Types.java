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

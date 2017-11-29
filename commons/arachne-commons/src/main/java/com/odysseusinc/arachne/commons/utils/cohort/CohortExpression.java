package com.odysseusinc.arachne.commons.utils.cohort;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.odysseusinc.arachne.commons.utils.CommonObjectJson;
import com.odysseusinc.arachne.commons.utils.annotations.OptionalField;
import com.odysseusinc.arachne.commons.utils.cohort.Types.ConceptSet;
import com.odysseusinc.arachne.commons.utils.cohort.Types.Criteria;
import com.odysseusinc.arachne.commons.utils.cohort.Types.CriteriaGroup;
import com.odysseusinc.arachne.commons.utils.cohort.Types.Limit;
import com.odysseusinc.arachne.commons.utils.cohort.Types.Rule;
import com.odysseusinc.arachne.commons.utils.cohort.Types.Settings;

public class CohortExpression extends CommonObjectJson {
    @OptionalField
    public String Title;
    public ConceptSet[] ConceptSets;
    public Criteria PrimaryCriteria;
    @OptionalField
    public CriteriaGroup AdditionalCriteria;
    public Limit QualifiedLimit;
    public Limit ExpressionLimit;
    public Rule[] InclusionRules;
    @OptionalField
    public Object EndStrategy;
    public Criteria CensoringCriteria;
    public Settings CollapseSettings;

    public CohortExpression(@JsonProperty(value = "Titlte") String title,
                            @JsonProperty(value = "ConceptSets", required = true) ConceptSet[] conceptSets,
                            @JsonProperty(value = "PrimaryCriteria", required = true) Criteria primaryCriteria,
                            @JsonProperty(value = "AdditionalCriteria") CriteriaGroup additionalCriteria,
                            @JsonProperty(value = "QualifiedLimit", required = true) Limit qualifiedLimit,
                            @JsonProperty(value = "ExpressionLimit", required = true) Limit expressionLimit,
                            @JsonProperty(value = "InclusionRules", required = true) Rule[] inclusionRules,
                            @JsonProperty(value = "EndStrategy") Object endStrategy,
                            @JsonProperty(value = "CensoringCriteria", required = true) Criteria censoringCriteria,
                            @JsonProperty(value = "CollapseSettings", required = true) Settings collapseSettings) {

        this.Title = title;
        this.ConceptSets = conceptSets;
        this.PrimaryCriteria = primaryCriteria;
        this.AdditionalCriteria = additionalCriteria;
        this.QualifiedLimit = qualifiedLimit;
        this.ExpressionLimit = expressionLimit;
        this.InclusionRules = inclusionRules;
        this.EndStrategy = endStrategy;
        this.CensoringCriteria = censoringCriteria;
        this.CollapseSettings = collapseSettings;
    }
}

package com.odysseusinc.arachne.commons.utils.cohort;

import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.commons.utils.JsonMatcher;

public class CohortDefinitionMatcher extends JsonMatcher {

    public static final String COHORT_JSON_EXT = ".json";

    {
        putToMap(CommonFileUtils.TYPE_COHORT_JSON, CohortExpression.class);
    }

    @Override
    protected boolean satisfy(String fileName) {

        return fileName.endsWith(COHORT_JSON_EXT);
    }
}

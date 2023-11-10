package com.odysseusinc.arachne.commons.utils.strategus;

import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import com.odysseusinc.arachne.commons.utils.JsonMatcher;

public class StrategusMatcher extends JsonMatcher {

    public static final String STRATEGUS_EXT = "json";

    {
        putToMap(CommonFileUtils.TYPE_STRATEGUS_JSON, StrategusExpression.class);
    }

    @Override
    protected boolean satisfy(String fileName) {
        return fileName.endsWith(STRATEGUS_EXT);
    }
}

/*
 * Copyright 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.commons.utils.strategus;

import com.odysseusinc.arachne.commons.utils.JsonMatcher;


public final class StrategusMatcher extends JsonMatcher {
    public static final StrategusMatcher INSTANCE = new StrategusMatcher();

    public static final String STRATEGUS_EXT = "json";
    public static final String TYPE_STRATEGUS_JSON = "strategusjson";

    private StrategusMatcher() {
        putToMap(TYPE_STRATEGUS_JSON, StrategusExpression.class);
    }

    @Override
    protected boolean satisfy(String fileName) {
        return fileName.endsWith(STRATEGUS_EXT);
    }
}

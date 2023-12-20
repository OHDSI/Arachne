/*******************************************************************************
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
 *******************************************************************************/

package com.odysseusinc.arachne.commons.api.v1.dto;

public class CommonAnalysisType {
    public static final CommonAnalysisType CUSTOM = new CommonAnalysisType("CUSTOM", "Custom", "cstm");
    public static final CommonAnalysisType STRATEGUS = new CommonAnalysisType("STRATEGUS", "Strategus", "strgs");

    private final String name;
    private final String title;
    private final String code;

    public CommonAnalysisType(String id, String title, String code) {
        this.name = id;
        this.title = title;
        this.code = code;
    }

    public String name() {
        return name;
    }

    public String getTitle() {

        return title;
    }

    public String getCode() {

        return code;
    }

    @Override
    public String toString() {
        return name;
    }
}

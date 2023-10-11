/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: June 27, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

public enum CommonAnalysisType {
    ESTIMATION("Population Level Effect Estimation", "ple"),
    CUSTOM("Custom", "cstm"),
    PREDICTION("Patient Level Prediction", "plp"),
    COHORT_CHARACTERIZATION("Cohort (Characterization)", "cc"),
    COHORT_HERACLES("Cohort (Heracles)", "cc_hrcls"),
    COHORT("Cohort (Simple Counts)", "c"),
    INCIDENCE("Incidence rates", "ir"),
    COHORT_PATHWAY("Cohort Pathway", "txp"),
    STRATEGUS("Strategus", "strgs"),

    /**
     * REPORTING is currently unsupported. This left for backward compatibility only.
     */
    @Deprecated
    REPORTING("Reporting", "rep");

    private String title;

    private String code;

    CommonAnalysisType(String title, String code) {

        this.title = title;
        this.code = code;
    }

    public String getTitle() {

        return title;
    }

    public String getCode() {

        return code;
    }
}

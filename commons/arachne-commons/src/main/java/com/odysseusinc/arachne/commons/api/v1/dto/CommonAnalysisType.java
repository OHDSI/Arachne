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
 * Created: June 27, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

public enum CommonAnalysisType {
    ESTIMATION("Population Level Effect Estimation"),
    REPORTING("Reporting"),
    CUSTOM("Custom"),
    CHARACTERIZATION("Clinical Characterization"),
    PREDICTION("Patient Level Prediction"),
    COHORT_CHARACTERIZATION("Cohort (Characterization)"),
    COHORT("Cohort (Simple Counts)");

    private String title;

    CommonAnalysisType(String title) {

        this.title = title;
    }

    public String getTitle() {

        return title;
    }
}

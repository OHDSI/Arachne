/*
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
 * Authors: Anton Gackovka
 * Created: June 5, 2018
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import java.util.ArrayList;
import java.util.List;

public class SubmissionsInvalidateDTO {
    
    private List<Long> analysisIds = new ArrayList<>();
    private String invalidateAuthor;

    public List<Long> getAnalysisIds() {

        return analysisIds;
    }

    public void setAnalysisIds(final List<Long> analysisIds) {

        this.analysisIds = analysisIds;
    }

    public String getInvalidateAuthor() {

        return invalidateAuthor;
    }

    public void setInvalidateAuthor(final String invalidateAuthor) {

        this.invalidateAuthor = invalidateAuthor;
    }
}

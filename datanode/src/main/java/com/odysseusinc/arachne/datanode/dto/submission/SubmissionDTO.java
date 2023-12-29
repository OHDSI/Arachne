/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.dto.submission;

import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceDTO;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisAuthor;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisOrigin;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionDTO {
    private Long id;
    private String study;
    private String analysis;
    private AnalysisOrigin origin;
    private DataSourceDTO dataSource;
    private String status;
    private AnalysisAuthor author;
    private Date submitted;
    private Date finished;
    private String environment;
}

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

package com.odysseusinc.arachne.datanode.dto.analysis;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Getter
@Setter
public class AnalysisRequestDTO {

    @NotBlank
    private String executableFileName;

    @NotNull
    private Long datasourceId;

    @NotNull
    private String title;

    private String study;

    @NotNull
    private String type;

    private String environmentId;

    private String dockerImage;

    private Map<String, String> parameters;
}

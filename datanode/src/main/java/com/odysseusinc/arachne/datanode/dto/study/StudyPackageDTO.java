/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

package com.odysseusinc.arachne.datanode.dto.study;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO for a study package (one installed name+version). Frontend may group by name.
 */
@Getter
@Setter
public class StudyPackageDTO {
    private Long id;
    private String name;
    private String version;
    private String script;
    private boolean running;
    private boolean hasResults;
}

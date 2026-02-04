/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

package com.odysseusinc.arachne.datanode.dto.study;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InstallStudyRequestDTO {
    private String name;
    private String version;
}

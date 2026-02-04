/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.dto.study;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Tags for a single repository (Docker image) from the registry, e.g. ACR /acr/v1/{repo}/_tags.
 * Used to populate study versions for a given repo.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryTagsDTO {
    /** Repository name, e.g. "myteam/myimage". */
    private String repo;
    /** Tag names, e.g. ["1.0.0", "latest"]. */
    private List<String> tags;
}

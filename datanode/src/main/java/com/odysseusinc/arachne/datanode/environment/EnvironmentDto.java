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
package com.odysseusinc.arachne.datanode.environment;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor(staticName = "of")
public class EnvironmentDto {
    private final List<Docker> docker;
    private final List<Tarball> tarball;

    @Getter
    @RequiredArgsConstructor(staticName = "of")
    public static class Docker {
        private final String imageId;
        private final List<String> tags;
    }

    @Getter
    @RequiredArgsConstructor(staticName = "of")
    public static class Tarball {
        private final String id;
        private final String label;
        private final String bundleName;
        private final String json;
    }
}

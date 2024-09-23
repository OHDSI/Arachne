/*
 * Copyright 2024 Odysseus Data Services, Inc.
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

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalysisDTO extends AnalysisRequestDTO {
    private Environment environment;

    @Getter
    @Setter
    public static class Environment {
        private Docker docker;
        private Tarball tarball;

        @Getter
        @AllArgsConstructor
        public static class Docker {
            private final String tag;
            private final String imageId;
        }

        @Getter
        @AllArgsConstructor
        public static class Tarball {
            private final String requestedId;
            private final Actual actual;

            @Getter
            @AllArgsConstructor
            public static class Actual {
                private final String descriptorId;
                private final String label;
            }
        }
    }

}

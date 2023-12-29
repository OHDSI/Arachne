/*
 * Copyright 2020, 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.commons.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.text.IsEmptyString.isEmptyString;
import static org.junit.Assert.assertThat;

public class AnalysisArchiveUtilsTest {

    public static final ObjectMapper MAPPER = new ObjectMapper();

    @Test
    public void shouldGetArchiveFileName() {

        LocalDateTime dateTime = LocalDateTime.of(2020, 1, 3, 13, 35, 20);
        assertThat(
                AnalysisArchiveUtils.getArchiveFileName(CommonAnalysisType.CUSTOM, "to be, or<>  (not to be)!", dateTime),
                is(equalTo("cstm-to_be_or_not_to_be-20200103.zip"))
        );
    }

    @Test
    public void shouldGetAnalysisNameByProperties() {

        assertThat(
                AnalysisArchiveUtils.getAnalysisName((Map<String, Object>) null),
                isEmptyString()
        );
        assertThat(
                AnalysisArchiveUtils.getAnalysisName(Collections.emptyMap()),
                isEmptyString()
        );
        assertThat(
                AnalysisArchiveUtils.getAnalysisName(Collections.singletonMap("wrong-key", "analysis-name")),
                isEmptyString()
        );
    }

    @Test
    public void shouldGetAnalysisNameByJsonForWrongArguments() {

        assertThat(
                AnalysisArchiveUtils.getAnalysisName(Collections.singletonMap("name", "analysis-name")),
                is(equalTo("analysis-name"))
        );

    }

    @Test
    public void shouldNotGetAnalysisNameByJsonForWrongArguments() throws Exception {

        JsonNode node = MAPPER.readTree("{\"wrong-field\": \"analysis-name\"}");
        assertThat(
                AnalysisArchiveUtils.getAnalysisName(node),
                isEmptyString()
        );

        node = null;
        assertThat(
                AnalysisArchiveUtils.getAnalysisName(node),
                isEmptyString()
        );
    }
}

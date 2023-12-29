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
package com.odysseusinc.arachne.commons.utils;

import com.odysseusinc.arachne.commons.utils.strategus.StrategusMatcher;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;

import java.io.IOException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.equalTo;

public class StrategusMatcherTest {

    @Test
    public void shouldDetectStrategusType() throws IOException {
        StrategusMatcher matcher = new StrategusMatcher();
        String contentType = matcher.getContentType("strategusStudy.json", getResource("/strategus/strategusStudy.json"));
        assertThat(contentType, is(equalTo(CommonFileUtils.TYPE_STRATEGUS_JSON)));
    }

    @Test
    public void shouldDetectStrategusWithoutMetadata() throws IOException {
        StrategusMatcher matcher = new StrategusMatcher();
        String contentType = matcher.getContentType("strategusStudy.json", getResource("/strategus/strategusStudy2.json"));
        assertThat(contentType, is(equalTo(CommonFileUtils.TYPE_STRATEGUS_JSON)));
    }

    private InputStreamSource getResource(String path) throws IOException {
        return new ByteArrayResource(IOUtils.resourceToByteArray(path));
    }
}

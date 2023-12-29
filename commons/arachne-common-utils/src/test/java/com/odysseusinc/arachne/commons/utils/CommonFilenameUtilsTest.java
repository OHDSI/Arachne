/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;

import org.hamcrest.Matcher;
import org.junit.Test;

public class CommonFilenameUtilsTest {

    private static final String testFilename = "filename?\"containing\"/illegal<:>ch\\ars:)";
    private static final String expectFilename = "filenamecontainingillegalchars)";
    private static final String posixTestFilename = "another:name|to/test";
    private static final String posixExpectName = "another:name|totest";

    @Test
    public void sanitizeFilename() {

        String strictName = CommonFilenameUtils.sanitizeFilename(testFilename);
        assertThat(strictName, is(equalTo(expectFilename)));

        String posixName = CommonFilenameUtils.sanitizeFilenamePosix(posixTestFilename);
        assertThat(posixName, is(equalTo(posixExpectName)));
    }
}

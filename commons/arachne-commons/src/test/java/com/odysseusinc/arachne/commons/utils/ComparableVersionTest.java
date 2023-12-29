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
package com.odysseusinc.arachne.commons.utils;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

import org.junit.Test;

/**
 * @author vkoulakov
 * @since 3/22/19.
 */
public class ComparableVersionTest {

	private ComparableVersion VERSION = new ComparableVersion("2.7.0");

	@Test
	public void testComparisons() {

		assertThat(VERSION.isGreaterOrEqualsThan("2.7.0"), is(true));
		assertThat(VERSION.isGreaterOrEqualsThan("2.5.3"), is(true));
		assertThat(VERSION.isGreaterOrEqualsThan("2.7.1"), is(false));
		assertThat(VERSION.isLesserThan("2.7.0-RELEASE"), is(true));
		assertThat(VERSION.isLesserOrEqualsThan("2.8.1"), is(true));
		assertThat(VERSION.isLesserOrEqualsThan("2.7.2.bcbs"), is(true));
	}
}

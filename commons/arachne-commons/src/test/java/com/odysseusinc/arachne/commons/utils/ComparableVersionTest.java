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
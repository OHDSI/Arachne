package com.odysseusinc.arachne.commons.utils;

import com.google.common.collect.ImmutableMap;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ComparableVersion implements Comparable<ComparableVersion> {

	private String originalVersion;
	private String prefix;
	private String suffix;
	private List<Integer> digits = new ArrayList<>();
	private static final String VERSION_REGEX = "(\\w+)*?((\\d+\\.*)+)([-_.](\\w+))*";
	private static final Map<String, Integer> KNOWN_QUALIFIERS = ImmutableMap.<String, Integer>builder()
					.put("snapshot", -1)
					.put("rc", 5)
					.put("qa", 10)
					.put("release", 15)
					.build();

	public ComparableVersion(String version) {

		this.originalVersion = version;
		parse(version);
	}

	private void parse(String version) {

		Pattern pattern = Pattern.compile(VERSION_REGEX);
		Matcher matcher = pattern.matcher(version);
		if (matcher.matches() && matcher.groupCount() > 4) {
			prefix = matcher.group(1);
			suffix = matcher.group(5);
			String digitStr = matcher.group(2);
			digits.clear();
			Arrays.stream(digitStr.split("\\.")).forEach(d -> digits.add(Integer.parseInt(d)));
		}
	}

	@Override
	public int compareTo(ComparableVersion o) {

		Iterator<Integer> left = digits.iterator();
		Iterator<Integer> right = o.digits.iterator();
		while(left.hasNext() || right.hasNext()) {
			Integer l = left.hasNext() ? left.next() : 0;
			Integer r = right.hasNext() ? right.next() : 0;
			int result = l.compareTo(r);
			if (result != 0) {
				return result;
			}
		}

		return Objects.compare(suffix, o.suffix, (l, r) -> {
			int lw = l != null ? KNOWN_QUALIFIERS.getOrDefault(l.toLowerCase(), 0) : 0;
			int rw = r != null ? KNOWN_QUALIFIERS.getOrDefault(r.toLowerCase(), 0) : 0;
			return lw - rw;
		});
	}

	@Override
	public boolean equals(Object o) {

		if (this == o) return true;
		if (!(o instanceof ComparableVersion)) return false;
		ComparableVersion that = (ComparableVersion) o;
		return Objects.equals(originalVersion, that.originalVersion);
	}

	@Override
	public int hashCode() {

		return Objects.hash(originalVersion);
	}

	public boolean isGreaterOrEqualsThan(ComparableVersion v) {

		return compareTo(v) >= 0;
	}

	public boolean isGreaterOrEqualsThan(String v) {

		return isGreaterOrEqualsThan(new ComparableVersion(v));
	}

	public boolean isGreaterThan(ComparableVersion v) {

		return compareTo(v) > 0;
	}

	public boolean isGreaterThan(String v) {

		return isGreaterThan(new ComparableVersion(v));
	}

	public boolean isLesserOrEqualsThan(ComparableVersion v) {

		return compareTo(v) <= 0;
	}

	public boolean isLesserOrEqualsThan(String v) {

		return isLesserOrEqualsThan(new ComparableVersion(v));
	}

	public boolean isLesserThan(ComparableVersion v) {

		return compareTo(v) < 0;
	}

	public boolean isLesserThan(String v) {

		return isLesserThan(new ComparableVersion(v));
	}
}

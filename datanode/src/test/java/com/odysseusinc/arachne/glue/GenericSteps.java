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

package com.odysseusinc.arachne.glue;

import com.google.gson.Gson;
import com.odysseusinc.arachne.datanode.util.Fn;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.When;
import lombok.SneakyThrows;
import org.apache.commons.beanutils.NestedNullException;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.Assertions;
import org.opentest4j.AssertionFailedError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import java.text.MessageFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class GenericSteps {
    private static Gson GSON = new Gson();

    @Autowired
    private World world;


    @When("it is {string}")
    public void assertCursor(String expected) {
        Assertions.assertEquals(expected, String.valueOf(world.getCursor()));
    }

    @When("^(which|it) is a list of:$")
    public void assertList(String __, DataTable dt) {
        List<?> cursor = toList(world.getCursor());
        assertList(dt, cursor);
    }

    @When("^(?:which|it) is a list containing:$")
    public void assertListContains(DataTable dt) {
        assertList(dt.asMaps(), toList(world.getCursor()));
    }

    @When("Date {string} = {string}")
    public void assertPropertiesEquals(String ref1, String ref2) {
        Instant instant1 = Instant.parse(world.ref(ref1));
        Instant instant2 = Instant.parse(world.ref(ref2));
        Assertions.assertEquals(instant1, instant2);
    }
    @When("Date {string} > {string}")
    public void assertDateIsAfter(String ref1, String ref2) {
        Instant instant1 = Instant.parse(world.ref(ref1));
        Instant instant2 = Instant.parse(world.ref(ref2));
        Assertions.assertTrue(instant1.isAfter(instant2));
    }

    @When("it has the following properties:")
    public void assertProperties(DataTable dt) {
        Object cursor = world.getCursor();
        if (cursor instanceof Exception) {
            throw new RuntimeException(((Exception) cursor).getCause());
        } else {
            assertProps(dt.asMap(), cursor);
        }
    }

    public void assertProps(Map<String, String> expectations, Object object) {
        Assertions.assertAll(
                expectations.entrySet().stream().map(entry -> () ->
                        assertWithCapture(entry.getValue(), String.valueOf(getProperty(object, entry.getKey())))
                )
        );
    }

    public static List<?> toList(Object cursor) {
        if (cursor instanceof Page) {
            return ((Page<?>) cursor).getContent();
        } else if (cursor instanceof List) {
            return (List<?>) cursor;
        } else if (cursor.getClass().isArray()) {
            return Arrays.asList((Object[]) cursor);
        } else if (cursor instanceof Throwable) {
            throw new AssertionFailedError("Found a previous error:", (Throwable) cursor);
        } else {
            throw new AssertionFailedError("Not a list: " + cursor.getClass());
        }
    }

    public void assertList(DataTable dt, List<?> items) {
        List<Map<String, String>> expectations = dt.asMaps();
        List<?> remaining = assertList(expectations, items);
        Assertions.assertTrue(remaining.isEmpty(), () ->
                "Extra items: " + dumpProperties(remaining, expectations.stream().findFirst().orElseThrow(RuntimeException::new).keySet())
        );
    }

    private <T> List<T> assertList(List<Map<String, String>> expectations, List<T> cursor) {

        List<T> values = new ArrayList<>(cursor);
        for (Map<String, String> expectation : expectations) {
            T found = expectation.entrySet().stream().reduce(
                    values.stream(), (stream, entry) -> stream.filter(matchesEntry(entry)), this::throwingCombiner
            ).findFirst().orElseThrow(() -> {
                String actual = dumpProperties(cursor, expectation.keySet());
                return new AssertionFailedError(
                        MessageFormat.format("For expectation [{0}], matching actual item not found. Actual items:{1}", expectation.toString(), actual)
                );
            });
            values.remove(found);
        }
        return values;
    }

    private <T> Predicate<T> matchesEntry(Entry<String, String> entry) {
        return item -> {
            String actual = Optional.ofNullable(getProperty(item, entry.getKey())).map(Object::toString).orElse(null);
            String value = entry.getValue();
            return matchWithCaptureOrAlias(value, actual);
        };
    }
    @SneakyThrows
    public static <T> Object getProperty(T item, String key) {
        String[] split = key.split("->", 2);
        try {
            Object resolvedValue = PropertyUtils.getProperty(item, split[0].trim());
            if (split.length == 1) {
                return resolvedValue;
            } else {
                String nextKey = split[1].trim();
                if (resolvedValue instanceof List) {
                    List<Object> list = (List<Object>) resolvedValue;
                    List<Object> result = new ArrayList<>();
                    for (Object value : list) {
                        Object nestedValue = getProperty(value, nextKey);
                        result.add(nestedValue);
                    }
                    return result;
                } else {
                    return getProperty(resolvedValue, nextKey);
                }
            }
        } catch (NoSuchMethodException | NestedNullException e) {
            return null;
        }
    }

    private void assertWithCapture(String expected, String actual) {
        Assertions.assertTrue(matchWithCaptureOrAlias(expected, actual), () ->
                MessageFormat.format("Expected [{0}], Actual [{1}]", expected, actual)
        );
    }

    private boolean matchWithCaptureOrAlias(String expected, String actual) {
        if (expected == null && actual == null) {
            return true;
        } else if (StringUtils.startsWith(expected, "~")) {
            String regex = StringUtils.substringAfter(expected, "~");
            return matchWithCapture(regex, actual);
        } else {
            return Objects.equals(world.resolveAlias(expected), actual);
        }
    }

    private boolean matchWithCapture(String regex, String actual) {
        Matcher matcher = Pattern.compile(regex, Pattern.DOTALL).matcher(actual);
        if (matcher.find()) {
            List<String> groups = findNamedGroups(regex);
            groups.forEach(name ->
                    world.capture(name, matcher.group(name))
            );
            return true;
        } else {
            return false;
        }
    }

    private List<String> findNamedGroups(String pattern) {
        Matcher matcher = Pattern.compile("\\(\\?<(?<name>.+?)>.+\\)").matcher(pattern);
        List<String> groups = new LinkedList<>();
        while (matcher.find()) {
            // Using regex named groups to find if pattern contains named groups
            groups.add(matcher.group("name"));
        }
        return groups;
    }

    private static <T> String dumpProperties(List<T> cursor, Set<String> keys) {
        String actual = cursor.stream().map(item ->
                keys.stream().map(key -> key + ": " + getProperty(item, key)).collect(Collectors.joining(", "))
        ).collect(Collectors.joining("\n - ", "\n - ", "\n==="));
        return actual;
    }

    private <T> T throwingCombiner(T a, T b) {
        throw new AssertionFailedError();
    }

    static <T> T create(Supplier<T> constructor, DataTable dt) {
        return create(constructor, dt.asMap());
    }

    static <T> List<T> createList(Supplier<T> constructor, DataTable dt) {
        return dt.asMaps().stream().map(create(constructor)).collect(Collectors.toList());
    }

    static <T> T create(Supplier<T> constructor, Map<String, String> dtMap) {
        return create(constructor).apply(dtMap);
    }

    static <T> Function<Map<String, String>, T> create(Supplier<T> constructor) {
        return dtMap ->
                Fn.create(constructor, dto ->
                        dtMap.forEach((key, value) ->
                                setProperty(dto, key, value)
                        )
                );
    }

    @SneakyThrows
    public static void setProperty(Object item, String key, Object value) {
        Class<?> type = PropertyUtils.getPropertyType(item, key);
        Object convertedValue = convertTo(value, type);
        PropertyUtils.setProperty(item, key, convertedValue);
    }

    private static Object convertTo(Object value, Class type) {
        if (type.equals(List.class)) {
            return Arrays.stream(String.valueOf(value).split(",")).collect(Collectors.toList());
        } else if (type.isEnum()) {
            return Enum.valueOf(type, String.valueOf(value));
        } else if (type.equals(boolean.class) || type.equals(Boolean.class)) {
            return Boolean.valueOf(value.toString());
        } else if (type.equals(int.class) || type.equals(Integer.class)) {
            return Integer.valueOf(value.toString());
        } else if (type.equals(long.class) || type.equals(Long.class)) {
            return Long.valueOf(value.toString());
        } else if (type.equals(UUID.class)) {
            return value instanceof UUID ? value : UUID.fromString(String.valueOf(value));
        } else if (!type.equals(String.class) && value instanceof String && ((String) value).startsWith("{")) {
            return GSON.fromJson((String) value, type);
        } else {
            return value;
        }
    }

}

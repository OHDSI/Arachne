/*
 * Copyright 2018, 2024 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.util;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Stream;

/**
 * Groups together functional utility methods with a very wide scope of usage
 * that can't be classified into a specific business domain.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class Fn {
    public static <T> T create(Supplier<T> constructor, Consumer<? super T> initializer) {
        T result = constructor.get();
        initializer.accept(result);
        return result;
    }

    public static <T, V extends T> Optional<V> castAs(T object, Class<V> clazz) {
        return clazz.isInstance(object) ? Optional.of((V) object) : Optional.empty();
    }

    public static <T, V extends T> Case<T, V> as(Class<V> clazz) {
        return object -> clazz.isInstance(object) ? Optional.of((V) object) : Optional.empty();
    }

    public static <T, V extends T, U> Function<T, Optional<U>> as(Class<V> clazz, Function<V, U> mapper) {
        return object -> clazz.isInstance(object) ? Optional.of((V) object).map(mapper) : Optional.empty();
    }

    public interface Case<T, V> extends Function<T, Optional<V>> {
        default <U> Case<T, U> map(Function<V, U> mapper) {
            return value -> apply(value).map(mapper);
        }
    }

    public static <T> Stream<T> stream(Collection<T> values) {
        return Stream.ofNullable(values).flatMap(Collection::stream);
    }

}

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

package com.odysseusinc.arachne.datanode.jpa;

import org.apache.commons.lang3.ArrayUtils;

import jakarta.persistence.criteria.AbstractQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.util.Arrays;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Stream;

/**
 * A generic functional container that allows Criteria Query building blocks to be injected from outside
 * of the transaction-bound code, providing access to CriteriaBuilder, CriteriaQuery and selection root.
 * This abstraction only supports single-root queries.
 * Compared to its {@link TypedJPAFunction} counterpart, this does not restrict generic type of CriteriaQuery.
 * This is usually preferred when defining low-level query blocks, such as predicate building function,
 * allowing them to be reused in different queries.
 *
 * @param <R> selection root.
 * @param <V> type of the yielded value.
 */
public interface JpaFunction<R, V> extends BiFunction<CriteriaBuilder, AbstractQuery<?>, Function<Path<R>, V>> {

    /**
     * Combines functions into a single function that produces a stream of results when applied.
     * This can be also seen as a specific case of "rotate" operation known in lambda calculus applied to a
     * composition of {@link Stream#map(Function)} and {@link JpaFunction} generic application.
     *
     * @param list of functions to combine
     */
    static <R, V> JpaFunction<R, Stream<V>> combine(List<? extends JpaFunction<R, V>> list) {
        return (cb, query) -> root -> {
            final Stream<V> vStream = list.stream()
                    .map(item -> item.apply(cb, query).apply(root));
            return vStream;
        };
    }

    static <R> JpaFunction<R, Predicate> or(JpaFunction<R, Predicate>... fns) {
        return or(Arrays.asList(fns));
    }

    static <R> JpaFunction<R, Predicate> or(List<? extends JpaFunction<R, Predicate>> list) {
        return (cb, query) -> combine(list).apply(cb, query).andThen(predicates ->
                predicates.reduce(cb::or).orElseGet(cb::disjunction)
        );
    }

    static <R> JpaFunction<R, Predicate> and(JpaFunction<R, Predicate>... fns) {
        return and(Arrays.asList(fns));
    }

    static <R> JpaFunction<R, Predicate> and(List<? extends JpaFunction<R, Predicate>> list) {
        return (cb, query) -> combine(list).apply(cb, query).andThen(predicates ->
                predicates.reduce(cb::and).orElseGet(cb::conjunction)
        );
    }

    static <R, V> JpaFunction<R, V[]> append(JpaFunction<R, V[]> a, JpaFunction<R, V> b) {
        return (cb, query) -> root -> ArrayUtils.add(
                a.apply(cb, query).apply(root),
                b.apply(cb, query).apply(root)
        );
    }

    /**
     * Returns a composed function that first applies this function to its input, and then applies the
     * {@code after} function to the result.
     *
     * @param after the function to apply after this function is applied
     * @param <Y>   the type of output of the {@code after} function, and of the composed function
     */
    default <Y> JpaFunction<R, Y> then(Function<V, Y> after) {
        return andThen(root -> root.andThen(after))::apply;
    }
}

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

import java.util.function.BiFunction;
import java.util.function.Function;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

/**
 * A generic functional container that allows Criteria Query building blocks to be injected from outside
 * of the transaction-bound code, providing access to CriteriaBuilder, CriteriaQuery and selection Root.
 * Compared to its {@link JPAFunction} counterpart, this provides a strongly-typed CriteriaQuery.
 * This is usually preferred when defining top-level query blocks that call type-sensitive methods on query
 * or need to maintain the type for nested calls.
 *
 * @param <T> Query result class
 * @param <R> Selection root.
 * @param <Y> Type of the yielded value.
 */
public interface TypedJPAFunction<T, R, Y> extends BiFunction<CriteriaBuilder, CriteriaQuery<T>, Function<Root<R>, Y>> {
}

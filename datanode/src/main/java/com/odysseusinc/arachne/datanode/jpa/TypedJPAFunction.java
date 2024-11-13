package com.odysseusinc.arachne.datanode.jpa;

import java.util.function.BiFunction;
import java.util.function.Function;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

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

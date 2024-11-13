package com.odysseusinc.arachne.datanode.jpa;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.metamodel.SingularAttribute;
import java.util.Collection;
import java.util.function.BiFunction;
import java.util.stream.Stream;

/**
 * A basic predicate-holding function.
 * Normally encapsulates predicate functions and one or more values required to apply it.
 *
 * @param <E> type of value on which predicates operate
 */
@FunctionalInterface
public interface JpaConditional<E> extends BiFunction<CriteriaBuilder, Path<E>, Predicate> {

    /**
     * A go-to where function for trivial queries selecting by a single attribute.
     * Not incredibly well-thought in terms of composition potential, but we'll need more active use cases
     * to sort that out.
     *
     * @param attribute attribute metamodel reference
     * @param value value to match against using equals
     * @param <E> Entity type
     * @param <V> Attribute value type
     */
    static <V, E> JpaConditional<E> has(SingularAttribute<? super E, V> attribute, V value) {
        return JpaPath.<E, V>of(attribute).equal(value);
    }

    static <V, U, E> JpaConditional<E> has(SingularAttribute<? super E, U> attribute1, SingularAttribute<? super U, V> attribute2, V value) {
        return JpaPath.<E, U, V>of(attribute1, attribute2).equal(value);
    }

    static <V, U, I, E> JpaConditional<E> has(SingularAttribute<? super E, V> attribute1, SingularAttribute<? super V, U> attribute2, SingularAttribute<? super U, I> attribute3, I value) {
        return JpaPath.<E, V, U, I>of(attribute1, attribute2, attribute3).equal(value);
    }

    static <E> JpaConditional<E> in(Collection<E> values) {
        return values.isEmpty() ? (cb, path) -> cb.disjunction() : (cb, path) -> path.in(values);
    }

    static <V, E> JpaConditional<E> in(SingularAttribute<? super E, V> attribute, Collection<V> values) {
        return JpaPath.<E, V>of(attribute).in(values);
    }

    static <V, U, E> JpaConditional<E> in(SingularAttribute<? super E, U> attribute1, SingularAttribute<? super U, V> attribute2, Collection<V> values) {
        return JpaPath.<E, U, V>of(attribute1, attribute2).in(values);
    }

    default JpaConditional<E> not() {
        return (cb, path) -> apply(cb, path).not();
    }

    static <E> JpaConditional<E> equal(E value) {
        return (cb, path) -> cb.equal(path, value);
    }

    static <E> JpaConditional<E> equal(Path<E> value) {
        return (cb, path) -> cb.equal(path, value);
    }

    static <E> JpaConditional<E> is(Expression<E> value) {
        return (cb, path) -> cb.equal(path, value);
    }

    static <V, E> JpaConditional<E> isNull(SingularAttribute<? super E, V> attribute) {
        return JpaPath.<E, V>of(attribute).isNull();
    }

    static <V, U, E> JpaConditional<E> isNull(SingularAttribute<? super E, U> attribute1, SingularAttribute<? super U, V> attribute2) {
        return JpaPath.<E, U, V>of(attribute1, attribute2).isNull();
    }

    /**
     * Merges multiple conditions operating on the same entity into a single one, using AND and merging operation.
     *
     * @param conditions conditions to merge
     * @param <E>        entity or attribute type of all conditions
     */
    @SafeVarargs
    static <E> JpaConditional<E> conjunction(JpaConditional<E>... conditions) {
        return (cb, path) -> Stream.of(conditions).map(
                condition -> condition.apply(cb, path)
        ).reduce(cb::and).orElseGet(cb::conjunction);
    }

    /**
     * Merges multiple conditions operating on the same entity into a single one, using OR operation.
     *
     * @param conditions conditions to merge
     * @param <E> entity or attribute type of all conditions
     */
    @SafeVarargs
    static <E> JpaConditional<E> disjunction(JpaConditional<E>... conditions) {
        return (cb, path) -> Stream.of(conditions).map(
                condition -> condition.apply(cb, path)
        ).reduce(cb::or).orElseGet(cb::disjunction);
    }


    /**
     * A functional composition method that applies current condition after extracting the provided attribute.
     * Purely for convenience purposes for cases when we have no need to define a variable to hold the transition path separately
     *
     * @param attribute attribute.
     * @param <T> entity type to read attribute from
     */
    default <T> JpaConditional<T> on(SingularAttribute<? super T, E> attribute) {
        return JpaPath.<T, E>of(attribute).that(this);
    }
}

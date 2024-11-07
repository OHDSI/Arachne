package com.odysseusinc.arachne.datanode.jpa;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.SingularAttribute;
import java.util.Collection;
import java.util.function.Function;

/**
 * Representation of one or more SingularAttributes as a function that takes one path and
 * transforms it into another.
 * It is responsibility of the developer who provides the implementation to ensure it is compatible
 * with whatever use case is at hand.
 * For example it is possible to implement it by providing a lambda function that relies on joins,
 * however these will fail in runtime if used in criteria delete query which doesn't allow joins.
 * There is no practical way to enforce this kind of restrictions and pure JPA doesn't do it either.
 *
 * @param <E> entity type
 * @param <T> resulting value type
 */
@FunctionalInterface
public interface JpaPath<E, T> extends Function<Path<E>, Path<T>>, JpaQueryExpression<E, T> {
    static <E, V> JpaPath<E, V> of(SingularAttribute<? super E, V> attribute) {
        return path -> path.get(attribute);
    }

    static <E, V, U> JpaPath<E, U> of(SingularAttribute<? super E, V> attribute1, SingularAttribute<? super V, U> attribute2) {
        return path -> path.get(attribute1).get(attribute2);
    }

    static <E, V, U, T> JpaPath<E, T> of(SingularAttribute<? super E, V> attribute1, SingularAttribute<? super V, U> attribute2, SingularAttribute<? super U, T> attribute3) {
        return path -> path.get(attribute1).get(attribute2).get(attribute3);
    }

    /**
     * Not really safe
     */
    static <E, V> JpaPath<E, V> joinLeft(SingularAttribute<? super E, V> attribute) {
        return path -> ((Root<E>) path).join(attribute, JoinType.LEFT);
    }

    default <E1> JpaPath<E1, T> on(SingularAttribute<? super E1, E> attribute) {
        return path -> apply(path.get(attribute));
    }

    default JpaConditional<E> notEqual(T value) {
        return (cb, path) -> cb.notEqual(apply(path), value);
    }

    default JpaConditional<E> isNot(Path<T> otherPath) {
        return (cb, path) -> cb.notEqual(apply(path), otherPath);
    }

    default JpaConditional<E> isNull() {
        return (cb, path) -> cb.isNull(apply(path));
    }

    default JpaConditional<E> isNotNull() {
        return (cb, path) -> cb.isNotNull(apply(path));
    }

    default JpaConditional<E> equal(T value) {
        return (cb, path) -> cb.equal(apply(path), value);
    }

    default JpaConditional<E> in(Collection<T> values) {
        return (cb, path) -> apply(path).in(values);
    }

    default JpaConditional<E> is(Path<T> otherPath) {
        return (cb, path) -> cb.equal(apply(path), otherPath);
    }

    default <V> JpaPath<E, V> map(SingularAttribute<? super T, V> attribute) {
        return path -> apply(path).get(attribute);
    }

    default JpaConditional<E> that(JpaConditional<T> conditional) {
        return (cb, path) -> conditional.apply(cb, apply(path));
    }

    default <R> JpaFunction<E, R> which(JpaFunction<T, R> jpaFunction) {
        return (cb, query) -> Function.super.andThen(jpaFunction.apply(cb, query));
    }

    @Override
    default Function<Path<E>, Expression<T>> apply(CriteriaBuilder cb) {
        return this::apply;
    }
}

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
import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.CriteriaUpdate;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.metamodel.SingularAttribute;

import static com.odysseusinc.arachne.datanode.jpa.JpaConditional.conjunction;

/**
 * Syntactic sugar to get more expressive semantics on the JPA operations.
 */
public interface JpaSugar {

    /**
     * Constructs a function to navigate from one path to another by a single metamode attribute.
     */
    static <T, V> Function<Path<T>, Path<V>> path(SingularAttribute<? super T, V> attribute) {
        return path -> path.get(attribute);
    }

    /**
     * Constructs a function to navigate from one path to another throuhg a chain of 2 attributes.
     */
    static <T, V, U> Function<Path<T>, Path<U>> path(
            SingularAttribute<? super T, V> attribute1, SingularAttribute<? super V, U> attribute2
    ) {
        return root -> root.get(attribute1).get(attribute2);
    }

    /**
     * Creates e select query to fetch all the entities of a given type
     *
     * @param em entity manager to use
     * @param clazz entity class
     * @param <E> entity type
     */
    static <E> TypedQuery<E> selectAll(EntityManager em, Class<E> clazz) {
        return select(em, clazz, (cb, query) -> root -> query);
    }

    /**
     * Creates a simple select query.
     *
     * @param em entity manager to use
     * @param clazz Root class to use in FROM query section
     * @param query query building function. Takes criteria builder, criteria query, root path and produces complete query
     * Normally, it should be adding only WHERE and ORDER BY sections, since grouping is rarely useful for a simple select.
     * @param <T> root entity type
     */
    static <T> TypedQuery<T> select(
            EntityManager em,
            Class<T> clazz,
            BiFunction<CriteriaBuilder, CriteriaQuery<T>, Function<Root<T>, CriteriaQuery<T>>> query
    ) {
        CriteriaQuery<T> criteriaQuery = query(em, clazz, (cb, cq) -> {
            Root<T> root = cq.from(clazz);
            return query.apply(cb, cq.select(root)).apply(root);
        });
        return em.createQuery(criteriaQuery);
    }

    /**
     * Creates a simple select query, with no ordering but straightforward, SQL-like semantics
     *
     * @param em entity manager to use
     * @param clazz Root class to use in FROM query section
     * @param <T> root entity type
     */
    static <T> Where<T, T, TypedQuery<T>> select(EntityManager em, Class<T> clazz) {
        return conditions -> select(em, clazz, (cb, query) -> root -> query.where(
                conjunction(conditions).apply(cb, root))
        );
    }

    static <E> Long count(EntityManager em, Class<E> clazz, EntityFilter<E> filter) {
        CriteriaQuery<Long> query = query(em, Long.class, (cb, cq) -> {
            Root<E> root = cq.from(clazz);
            return cq.select(cb.count(root)).where(filter.apply(cb, cq).apply(root));
        });
        return em.createQuery(query).getSingleResult();
    }

   /**
     * Creates a generic tupled query.
     *
     * @param em entity manager to use
     * @param clazz Root class to use in FROM query section. Note that while nothing prevents caller from spawning
     * a multi-root query using this method, however it is not advised to do so, as this is not something what the
     * reader might expect
     * @param query query building function. Takes criteria builder, criteria query, root path and produces complete query
     * @param <T> root entity type
     * @param <V> method return type.
     */
    static <T, V> V queryTuple(EntityManager em, Class<T> clazz, TypedJPAFunction<Tuple, T, V> query) {
        return query(em, Tuple.class, (cb, cq) -> query.apply(cb, cq).apply(cq.from(clazz)));
    }

    /**
     * The most basic syntactic sugar function that saves the caller the need to write
     * EntityManager.getCriteriaBuilder() and CriteriaQuery.createQuery() calls
     * @param em entity manager to use
     * @param clazz query return class
     * @param query query building function. Takes criteria builder, criteria query, root path and produces complete query
     * @param <T> query return type
     * @param <V> method return type. Since this function does not perform a call to em.createQuery() itself,
     * this allows for flexible return type, so that the caller can do it both inside the query function
     * or as part of processing return value from this method
     */
    static <T, V> V query(EntityManager em, Class<T> clazz, BiFunction<CriteriaBuilder, CriteriaQuery<T>, V> query) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        return query.apply(cb, cb.createQuery(clazz));
    }

    static <E> int update(
            EntityManager em, Class<E> clazz,
            BiFunction<CriteriaBuilder, CriteriaUpdate<E>, Function<Path<E>, CriteriaUpdate<E>>> query
    ) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaUpdate<E> q = cb.createCriteriaUpdate(clazz);
        return em.createQuery(query.apply(cb, q).apply(q.from(clazz))).executeUpdate();
    }

    @FunctionalInterface
    interface Where<T, R, Y> extends Function<JpaConditional<R>[], Y> {
        @Override
        default Y apply(JpaConditional<R>[] fn) {
            return where(fn);
        }

        Y where(JpaConditional<R>... biFunctions);
    }

}

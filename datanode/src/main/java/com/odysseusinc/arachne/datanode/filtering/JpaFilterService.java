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

package com.odysseusinc.arachne.datanode.filtering;

import com.odysseusinc.arachne.datanode.jpa.JpaFunction;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.filtering.dto.FilterDto;
import com.odysseusinc.arachne.datanode.filtering.dto.FilterItemDto;
import com.odysseusinc.arachne.datanode.filtering.dto.FilterItemOptionDto;
import com.odysseusinc.arachne.datanode.jpa.JpaOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @param <E> Entity type
 */
@RequiredArgsConstructor
public class JpaFilterService<E> {

    private final EntityManager em;

    /**
     * Entity class
     */
    private final Class<E> clazz;

    /**
     * List of static filters supported for a given entity
     */
    private final List<FilterOption<E>> staticFilters;

    /**
     * Supplier of dynamic filters supported for a given entity
     */
    private final Supplier<Stream<FilterOption<E>>> dynamicFilters;

    private final Function<String, String> orderMapping;


    public JpaFilterService(EntityManager em, Class<E> clazz, List<FilterOption<E>> staticFilters) {
        this(em, clazz, staticFilters, Stream::empty, Function.identity());
    }


    public FilterDto getFilter(JpaFunction<E, Predicate> predicate, Map<String, List<String>> options) {
        return getFilterDto(otherFilters ->
                JpaFunction.append(matchingPredicates(options, otherFilters), predicate));
    }


    private FilterDto getFilterDto(Function<Stream<FilterOption<E>>, JpaFunction<E, Predicate[]>> predicates) {
        List<FilterOption<E>> filters = getFilters();
        List<FilterItemDto> items = filters.stream().map(filter -> {
            Stream<FilterOption<E>> otherFilters = filters.stream().filter(f -> f != filter);
            List<FilterItemOptionDto> dtos = filter.getGrouping().apply(clazz).apply(em, predicates.apply(otherFilters));
            return new FilterItemDto(filter.getName(), dtos);
        }).collect(Collectors.toList());
        return new FilterDto(items);
    }


    private List<FilterOption<E>> getFilters() {
        return Stream.concat(
                staticFilters.stream(),
                dynamicFilters.get()
        ).collect(Collectors.toList());
    }

    @Transactional
    public <T> Page<T> list(Map<String, List<String>> options, Pageable pageable, Function<E, T> converter) {
        return page(options, pageable, listConverter(converter));
    }

    /**
     * @deprecated use one of the methods without converted
     */
    @Transactional
    public <T> Page<T> list(JpaFunction<E, Predicate> predicate, Map<String, List<String>> options, Pageable pageable, Function<E, T> converter) {
        return page(predicate, options, pageable, listConverter(converter));
    }

    @Transactional
    public <T> Page<T> page(Map<String, List<String>> options, Pageable pageable, Function<Stream<E>, List<T>> converter) {
        return list(pageable, converter, matchingPredicates(options));
    }

    @Transactional
    public Page<E> page(Map<String, List<String>> options, Pageable pageable) {
        JpaFunction<E, Predicate[]> predicates = matchingPredicates(options);
        return list(pageable, stream -> stream.collect(Collectors.toList()), predicates);
    }

    @Transactional
    public Page<E> page(JpaFunction<E, Predicate> predicate, Map<String, List<String>> options, Pageable pageable) {
        JpaFunction<E, Predicate[]> predicates = matchingPredicates(options);
        return list(pageable, stream -> stream.collect(Collectors.toList()), JpaFunction.append(predicates, predicate));
    }

    @Transactional
    public Page<E> page(JpaFunction<E, Predicate> predicate, Map<String, List<String>> options, Pageable pageable, List<JpaOrder<E>> orders) {
        JpaFunction<E, Predicate[]> predicates = matchingPredicates(options);
        return list(pageable, stream -> stream.collect(Collectors.toList()), JpaFunction.append(predicates, predicate), orders);
    }

    @Transactional
    public Page<E> page(Map<String, List<String>> options, Pageable pageable, List<JpaOrder<E>> orders) {
        JpaFunction<E, Predicate[]> predicates = matchingPredicates(options);
        return list(pageable, stream -> stream.collect(Collectors.toList()), predicates, orders);
    }


    /**
     * @deprecated Abstraction failure.
     * Converters that don't require aggregated state can be replaced with a call Page.map() cleanly, avoiding unnecessary coupling.
     * Converters that require aggregated state have to collect the values into a list anyway, (see how it ended up in StudyServiceImpl).
     * In either case, Stream-based converter brings in complexity and the need for extra collection operation or teeing collector
     * and brings no value. Eventually, once all stream-based converters are eliminated we can clear page methods to work via getResultList()
     */
    @Transactional
    public <T> Page<T> page(JpaFunction<E, Predicate> predicate, Map<String, List<String>> options, Pageable pageable, Function<Stream<E>, List<T>> converter) {
        JpaFunction<E, Predicate[]> predicates = matchingPredicates(options);
        return list(pageable, converter, JpaFunction.append(predicates, predicate));
    }

    private <T> Function<Stream<E>, List<T>> listConverter(Function<E, T> converter) {
        return stream -> stream.map(converter).collect(Collectors.toList());
    }

    private <T> PageImpl<T> list(Pageable pageable, Function<Stream<E>, List<T>> converter, JpaFunction<E, Predicate[]> predicates) {
        return list(pageable, converter, predicates, null);
    }

    private <T> PageImpl<T> list(Pageable pageable, Function<Stream<E>, List<T>> converter, JpaFunction<E, Predicate[]> predicates, List<JpaOrder<E>> orders) {
        List<T> dtos = converter.apply(streamPage(pageable, pageable.getSort(), predicates, orders));
        return new PageImpl<>(dtos, pageable, count(predicates));
    }

    private Stream<E> streamPage(Pageable pageable, Sort sort, JpaFunction<E, Predicate[]> predicates, List<JpaOrder<E>> orders) {
        return streamPage(JpaSugar.select(em, clazz, (cb, query) -> root -> {
            List<Order> orderBy = Optional.ofNullable(orders).map(ords -> ords.stream().map(order ->
                    order.apply(cb, root)).collect(Collectors.toList())).orElseGet(() -> convertOrder(sort, cb, root)
            );
            return query.where(predicates.apply(cb, query).apply(root)).orderBy(orderBy);
        }), pageable);
    }

    public Stream<E> streamPage(TypedQuery<E> query, Pageable pageable) {
        if (pageable.isPaged()) {
            query.setFirstResult(Math.toIntExact(pageable.getOffset()));
            query.setMaxResults(pageable.getPageSize());
        }
        // Using .getResultStream() here causes a weird "org.h2.jdbc.JdbcSQLException: The object is already closed [90007-196]",
        // despite the transaction configuration looking fine
        return query.getResultList().stream();
    }

    private List<Order> convertOrder(Sort sort, CriteriaBuilder cb, Root<E> root) {
        // This is ugly, but relatively compact crutch to get DTO orders work right
        // Strictly speaking, this is abstraction leak and each filter should yields a related order
        // in addition to predicate (in JpaFunction<E, Predicate>).
        // This will severely complicate the setup, adding an extra levels of functional complexity.
        // spring-data developers clearly recognized this problem when it was also late and wrote some crazy,
        // code to circumvent that org.springframework.data.jpa.repository.query.QueryUtils.toExpressionRecursively()
        // That code is unreliable and will not work for some corner cases (for example, since it does query analysis
        // if any query construction happens after QueryUtils.toOrders() is executed, it will not be accounted for,
        // potentially causing overhead joins in the query or sorting by inverse-mapped one-to-one relation might not
        // work at all, however it should be good enough for our current use case.
        Sort.Order[] orders = sort.stream().map(order ->
                new Sort.Order(order.getDirection(), orderMapping.apply(order.getProperty()), order.getNullHandling())
        ).toArray(Sort.Order[]::new);

        return QueryUtils.toOrders(Sort.by(orders), root, cb);
    }


    private Long count(JpaFunction<E, Predicate[]> predicates) {
        return JpaSugar.queryTuple(em, clazz, (cb, query) -> root -> {
            Expression<Long> count = cb.count(root);
            return em.createQuery(
                    query.multiselect(count).where(predicates.apply(cb, query).apply(root))
            ).getResultList().stream().map(result -> result.get(count)).reduce(0L, Long::sum);
        });
    }

    public JpaFunction<E, Predicate[]> matchingPredicates(Map<String, List<String>> options) {
        return matchingPredicates(options, getFilters().stream());
    }


    private JpaFunction<E, Predicate[]> matchingPredicates(Map<String, List<String>> options, Stream<FilterOption<E>> filters) {
        Map<String, List<String>> safeOptions = Optional.ofNullable(options).orElseGet(Collections::emptyMap);
        // TODO This ignores incorrect filter names for now, because doing so was easier. Dicscuss if we want fail fast in that case
        return JpaFunction.combine(
                filters.flatMap(filter ->
                        ofNullable(
                                safeOptions.get(filter.getName())
                        ).map(filter.getPredicates())
                ).collect(Collectors.toList())
        ).then(stream -> stream.toArray(Predicate[]::new));
    }

    static <T> Stream<T> ofNullable(T t) {
        return t == null ? Stream.empty() : Stream.of(t);
    }

}

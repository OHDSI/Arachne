package com.odysseusinc.arachne.datanode.filtering;

import com.odysseusinc.arachne.datanode.filtering.dto.PPage;
import com.odysseusinc.arachne.datanode.jpa.JpaOrder;
import com.odysseusinc.arachne.datanode.jpa.JpaQueryExpression;
import com.odysseusinc.arachne.datanode.jpa.EntityFilter;
import com.odysseusinc.arachne.datanode.filtering.dto.FilterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Generall purpose superclass for list services
 *
 * @param <E> Entity class
 * @param <D> DTO class
 */
public abstract class JpaListService<E, D> implements FilteredService<D> {
    private final Map<String, ? extends JpaQueryExpression<E, ?>> sorts;

    @Autowired
    protected JpaFilterService<E> filterService;

    public JpaListService(Stream<Entry<String, ? extends JpaQueryExpression<E, ?>>> sorts) {
        this.sorts = sorts.collect(Collectors.toMap(Entry::getKey, Entry::getValue));
    }

    @Transactional
    @Override
    public FilterDto getFilters(Map<String, List<String>> options) {
        return filterService.getFilter(getScopeFilter(), options);
    }
    protected EntityFilter<E> getScopeFilter() {
        return (cb, query) -> path -> cb.conjunction();
    }


    @Transactional
    @Override
    public Page<D> list(Map<String, List<String>> options, Pageable pageable) {
        List<JpaOrder<E>> orders = pageable.getSort().stream().map(this::toOrder).collect(Collectors.toList());
        Page<E> page = filterService.page(options, pageable, orders);
        return PPage.of(getActions(), page.map(toDto(page.getContent())));
    }

    private JpaOrder<E> toOrder(Sort.Order order) {
        JpaQueryExpression<E, ?> path = sorts.computeIfAbsent(order.getProperty(), value -> {
            throw new RuntimeException("Unsupported sort property [" + value + "]");
        });
        return order.getDirection().isAscending() ? asc(path) : desc(path);
    }


    protected static <E> JpaOrder<E> desc(JpaQueryExpression<E, ?> path) {
        return (cb, root) -> cb.desc(path.apply(cb).apply(root));
    }

    protected static <E> JpaOrder<E> asc(JpaQueryExpression<E, ?> path) {
        return (cb, root) -> cb.asc(path.apply(cb).apply(root));
    }


    @Transactional
    @Override
    public Collection<String> getSorts() {
        return sorts.keySet();
    }

    protected List<String> getActions() {
        return Collections.emptyList();
    }

    protected abstract Function<E, D> toDto(List<E> entities);


}

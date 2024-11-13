package com.odysseusinc.arachne.datanode.filtering;

import com.odysseusinc.arachne.datanode.filtering.FilterOption.Grouping;
import com.odysseusinc.arachne.datanode.jpa.JpaFunction;
import com.odysseusinc.arachne.datanode.jpa.JpaPath;

import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import java.util.List;
import java.util.function.Function;

/**
 * Factory functions for common types of filters that are not complex enough to qualify for a separate class to hold them.
 */
public class Filters {

    public static <E> FilterOption<E> byString(
            String name, JpaPath<E, String> path
    ) {
        return by(name, path, Function.identity(), Function.identity(), Function.identity());
    }

    private static <E, V> FilterOption<E> by(
            String name,
            Function<Path<E>, Path<V>> path,
            Function<V, String> fnLabel1,
            Function<V, String> enumStr,
            Function<String, V> parseIdentity1) {
        Grouping<E> grouping = Grouping.count(path, FilterOption.ResultParser.basic(fnLabel1, enumStr));
        return FilterOption.of(name,
                identityPredicates(path, parseIdentity1),
                grouping);
    }

    public static <E, K> Function<List<String>, JpaFunction<E, Predicate>> identityPredicates(
            Function<Path<E>, Path<K>> identity, Function<String, K> parseIdentity
    ) {
        return items -> (cb, query) -> root -> {
            Path<K> path = identity.apply(root);
            return items.stream().map(item ->
                    cb.equal(path, parseIdentity.apply(item))
            ).reduce(cb::or).orElse(cb.and());
        };
    }

}

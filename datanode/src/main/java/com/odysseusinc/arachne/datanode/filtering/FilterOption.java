package com.odysseusinc.arachne.datanode.filtering;

import com.odysseusinc.arachne.datanode.filtering.dto.FilterItemOptionDto;
import com.odysseusinc.arachne.datanode.jpa.JpaFunction;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.EntityManager;
import javax.persistence.Tuple;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @param <E> Entity type
 */
@AllArgsConstructor(staticName = "of")
@Getter
public class FilterOption<E> {
    /**
     * Filter name, for identification purposes
     */
    private final String name;
    /**
     * A function that builds predicate based on multiple selected filter options.
     * This is used to:
     * 1. Calculate counts for *other* filters
     * 2. Build actual query with items with all filters included
     */
    private final Function<List<String>, JpaFunction<E, Predicate>> predicates;
    /**
     * A function that builds a set of filter options based on given entity class and predicates for other selected
     * filter options. This includes calculating counts and producing correct FIQL queries for the case.
     * Note that while the generic signature here matches Grouping<E> abstraction, we want to keep it this way
     * to allow consumers to use functional composition to produce it.
     */
    private final Function<Class<E>, BiFunction<EntityManager, JpaFunction<E, Predicate[]>, List<FilterItemOptionDto>>> grouping;

    /**
     * Builds a set of filter options based on given entity class and predicates for other selected
     * filter options. This includes calculating counts and producing correct FIQL queries for the case.
     */
    public interface Grouping<E> extends Function<Class<E>, BiFunction<EntityManager, JpaFunction<E, Predicate[]>, List<FilterItemOptionDto>>> {
        /**
         * Calculates counts by grouping over a simple selection path.
         *
         * @param path function to provide path for grouping. Note that JPA currently doesn't support GROUP BY over an
         * arbitrary Expression and will fail with NoViableAltException, for example "unexpected AST node: =" if attempted
         * with Predicate. So this *requires* Path as a return value to prevent such runtime errors.
         * The following web page offers well-written explanation of what types of GROUP BY are possible with JPA:
         * https://www.objectdb.com/java/jpa/query/jpql/group
         * @param resultParser Converts the result of the query into filter options
         * @param <E> Entity type
         * @param <V> Grouping attribute value type
         */
        static <E, V> Grouping<E> count(Function<Path<E>, ? extends Expression<V>> path, ResultParser<V> resultParser) {
            return clazz -> (em, predicates) ->
                    JpaSugar.queryTuple(em, clazz, (cb, query) -> root -> {
                        Expression<V> attribute = path.apply(root);
                        Expression<Long> count = cb.count(root);
                        CriteriaQuery<Tuple> select = query.multiselect(attribute, count);
                        // TODO Change to .getResultStream(), list is only for debugging
                        Predicate[] otherFilters = predicates.apply(cb, select).apply(root);
                        List<Tuple> results = em.createQuery(
                                select.where(otherFilters).groupBy(attribute)
                        ).getResultList();
                        return resultParser.apply(results.stream()).apply(attribute, count).collect(Collectors.toList());
                    });
        }
    }

    /**
     * Converts the result of the query into actual filter options. This allows filters to present
     * even a number of options different from the number of rows in query results.
     *
     * @param <V> value type of the grouping attribute
     */
    public interface ResultParser<V> extends
            Function<Stream<Tuple>, BiFunction<Expression<V>, Expression<Long>, Stream<FilterItemOptionDto>>> {

        static ResultParser<String> identity() {
            return basic(Function.identity(), Function.identity());
        }

        /**
         * The most basic result parser. Matches one result in the grouped query to one filter option.
         *
         * @param fnLabel Produces option label from a result item
         * @param identity Produces item key
         * @param <V> Type of the result item being processed
         */
        static <V> ResultParser<V> basic(Function<V, String> fnLabel, Function<? super V, String> identity) {
            return parser((value, hits) -> {
                String key = identity.apply(value);
                String label = fnLabel.apply(value);
                return new FilterItemOptionDto(label, key, hits);
            });
        }

        static <V> ResultParser<V> parser(BiFunction<V, Long, FilterItemOptionDto> parse) {
            return results -> (path, count) -> results.map(tuple -> parse.apply(tuple.get(path), tuple.get(count)));
        }
    }

}

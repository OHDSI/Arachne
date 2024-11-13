package com.odysseusinc.arachne.datanode.jpa;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Path;
import java.util.function.Function;

@FunctionalInterface
public interface JpaQueryExpression<E, T>  {
    Function<Path<E>, Expression<T>> apply(CriteriaBuilder criteriaBuilder);
}

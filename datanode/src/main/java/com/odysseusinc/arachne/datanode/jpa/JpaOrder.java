package com.odysseusinc.arachne.datanode.jpa;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Path;
import java.util.function.BiFunction;

@FunctionalInterface
public interface JpaOrder<E> extends BiFunction<CriteriaBuilder, Path<E>, Order> {
}

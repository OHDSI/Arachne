package com.odysseusinc.scheduler.repository;

import com.cosium.spring.data.jpa.entity.graph.domain.EntityGraph;
import com.cosium.spring.data.jpa.entity.graph.repository.EntityGraphJpaRepository;
import com.odysseusinc.scheduler.model.ArachneJob;
import java.util.List;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ArachneJobRepository<T extends ArachneJob> extends EntityGraphJpaRepository<T, Long> {

    List<T> findAllByEnabledTrueAndIsClosedFalse(EntityGraph entityGraph);

    List<T> findAllByEnabledTrueAndIsClosedFalse();
}

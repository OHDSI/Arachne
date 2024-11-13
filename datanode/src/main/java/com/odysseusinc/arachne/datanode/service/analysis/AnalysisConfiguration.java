package com.odysseusinc.arachne.datanode.service.analysis;

import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis_;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource_;
import com.odysseusinc.arachne.datanode.filtering.Filters;
import com.odysseusinc.arachne.datanode.filtering.JpaFilterService;
import com.odysseusinc.arachne.datanode.jpa.JpaPath;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collections;

@Configuration
@ComponentScan
public class AnalysisConfiguration {

    @PersistenceContext
    private EntityManager em;

    @Bean
    public JpaFilterService<Analysis> analysisFilterService() {
        return new JpaFilterService<>(em, Analysis.class, Collections.singletonList(
                Filters.byString("type", JpaPath.of(Analysis_.dataSource, DataSource_.name))
        ));
    }
}

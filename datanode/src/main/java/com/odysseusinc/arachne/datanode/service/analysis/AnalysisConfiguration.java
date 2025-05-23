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

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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

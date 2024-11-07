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

import com.google.common.collect.ImmutableMap;
import com.odysseusinc.arachne.datanode.dto.converters.AnalysisToSubmissionDTOConverter;
import com.odysseusinc.arachne.datanode.dto.submission.SubmissionDTO;
import com.odysseusinc.arachne.datanode.filtering.JpaListService;
import com.odysseusinc.arachne.datanode.jpa.JpaPath;
import com.odysseusinc.arachne.datanode.jpa.JpaQueryExpression;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisAuthor_;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisState;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry_;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis_;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource_;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Root;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AnalysisListService extends JpaListService<Analysis, SubmissionDTO> {


    private static final ImmutableMap<AnalysisState, Integer> STATE_PRIORITY_ORDER = ImmutableMap.<AnalysisState, Integer>builder()
            .put(AnalysisState.ABORT, 10)
            .put(AnalysisState.ABORTED, 20)
            .put(AnalysisState.COMPLETED, 30)
            .put(AnalysisState.EXECUTE, 50)
            .put(AnalysisState.FAILED, 60)
            .put(AnalysisState.INITIALIZE, 70)
            .put(AnalysisState.UNKNOWN, 80)
            .build();

    @Autowired
    private AnalysisToSubmissionDTOConverter converter;

    private static Map<String, JpaQueryExpression<Analysis, ?>> sorts() {
        return ImmutableMap.<String, JpaQueryExpression<Analysis, ?>>builder()
                .put("id", JpaPath.of(Analysis_.id))
                .put("author.firstName", JpaPath.of(Analysis_.author, AnalysisAuthor_.firstName))
                .put("author.lastName", JpaPath.of(Analysis_.author, AnalysisAuthor_.lastName))
                .put("dataSource.name", JpaPath.of(Analysis_.dataSource, DataSource_.name))
                .put("title", JpaPath.of(Analysis_.title))
                .put("environment", JpaPath.of(Analysis_.environment))
                .put("submitted", JpaPath.of(Analysis_.created))
                .put("finished", finished())
                .put("status", status())
                .build();
    }

    private static JpaQueryExpression<Analysis, Date> finished() {
        return cb -> path -> {
            Root<Analysis> root = (Root<Analysis>) path;
            Join<Analysis, AnalysisStateEntry> state = root.join(Analysis_.currentState, JoinType.LEFT);
            Path<Date> date = state.get(AnalysisStateEntry_.date);
            return cb.<Date>selectCase()
                    .when(root.get(Analysis_.state).in(AnalysisState.TERMINAL_VALUES), date)
                    .otherwise(cb.nullLiteral(Date.class));
        };
    }

    private static JpaQueryExpression<Analysis, Integer> status() {
        return cb -> path -> {
            Root<Analysis> root = (Root<Analysis>) path;
            CriteriaBuilder.Case<Integer> caseExpression = cb.selectCase();
            for (Map.Entry<AnalysisState, Integer> entry : STATE_PRIORITY_ORDER.entrySet()) {
                caseExpression = caseExpression.when(
                        cb.equal(root.get(Analysis_.state), entry.getKey()),
                        entry.getValue()
                );
            }
            return caseExpression;
        };
    }

    public AnalysisListService() {
        super(
                sorts().entrySet().stream().map(entry -> entry)
        );
    }

    @Override
    protected Function<Analysis, SubmissionDTO> toDto(List<Analysis> entities) {
        return converter::convert;
    }
}

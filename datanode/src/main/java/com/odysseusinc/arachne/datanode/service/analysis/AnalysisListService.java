package com.odysseusinc.arachne.datanode.service.analysis;

import com.google.common.collect.ImmutableMap;
import com.odysseusinc.arachne.datanode.dto.converters.AnalysisToSubmissionDTOConverter;
import com.odysseusinc.arachne.datanode.dto.submission.SubmissionDTO;
import com.odysseusinc.arachne.datanode.filtering.JpaListService;
import com.odysseusinc.arachne.datanode.jpa.JpaPath;
import com.odysseusinc.arachne.datanode.jpa.JpaQueryExpression;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisAuthor_;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry_;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis_;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource_;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Path;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AnalysisListService extends JpaListService<Analysis, SubmissionDTO> {

    private static final int FAILED = 4;
    private static final ImmutableMap<String, Integer> STAGE_PRIORITIES = ImmutableMap.of(
            Stage.ABORT, 1,
            Stage.ABORTED, 2,
            Stage.COMPLETED, 3,
            Stage.EXECUTE, 5,
            Stage.INITIALIZE, 6
    );

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
                .put("submitted", JpaPath.of(Analysis_.initialState, AnalysisStateEntry_.date))
                .put("finished", finished())
                .put("status", status())
                .build();
    }

    private static JpaQueryExpression<Analysis, Date> finished() {
        return cb -> root -> {
            Path<Date> date = root.get(Analysis_.currentState).get(AnalysisStateEntry_.date);
            return cb.<Date>selectCase()
                    .when(cb.isNotNull(root.get(Analysis_.error)), date)
                    .when(root.get(Analysis_.stage).in(Stage.COMPLETED, Stage.ABORTED), date)
                    .otherwise(cb.nullLiteral(Date.class));
        };
    }

    private static JpaQueryExpression<Analysis, Integer> status() {
        return cb -> root -> {
            CriteriaBuilder.Case<Integer> caseExpression = cb.selectCase();
            caseExpression.when(cb.isNotNull(root.get(Analysis_.error)), FAILED);
            for (Map.Entry<String, Integer> entry : STAGE_PRIORITIES.entrySet()) {
                caseExpression = caseExpression.when(root.get(Analysis_.stage).in(
                        entry.getKey()), entry.getValue()
                );
            }
            return caseExpression.otherwise(10);
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

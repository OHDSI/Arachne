package com.odysseusinc.arachne.datanode.repository.implementation;

import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.repository.AnalysisRepositoryExtended;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class AnalysisRepositoryImpl implements AnalysisRepositoryExtended {
  @PersistenceContext
  private EntityManager entityManager;
  @Override
  public Page<Analysis> findAllPagingSortingByCalculateFields(String direction,
      String sortField, Pageable pageable) {

    StringBuilder sqlBuilder = new StringBuilder();
    StringBuilder countBuilder = new StringBuilder();

    sqlBuilder.append("SELECT a.* FROM analyses a ")
        .append("JOIN analysis_state_journal AS J ON J.analysis_id = a.id ")
        .append("JOIN (")
        .append("SELECT J.analysis_id, ")
        .append("MAX(J.date) AS finished, ")
        .append("MIN(J.date) AS submitted ")
        .append("FROM analysis_state_journal J ")
        .append("GROUP BY J.analysis_id) JS ON J.analysis_id=JS.analysis_id AND J.date = JS.finished ")
        .append("ORDER BY ");

    if(sortField!=null && sortField.equals("finished"))
    {
      sqlBuilder.append("CASE WHEN J.state IN('EXECUTING','CREATED') ")
          .append("THEN null ")
          .append("ELSE JS.finished END ");
    }else if(sortField!=null && sortField.equals("status"))
    {
      sqlBuilder.append("CASE WHEN J.state = 'ABORT_FAILURE'  ")
          .append("THEN 'Failed to Abort' ")
          .append("WHEN J.state = 'EXECUTION_FAILURE'  ")
          .append("THEN 'Failed' ")
          .append("ELSE J.state END ");
    }else if(sortField!=null && sortField.equals("submitted"))
    {
      sqlBuilder.append("JS.submitted ");
    }
    sqlBuilder.append(direction);
    sqlBuilder.append(" NULLS LAST");

    Query query = entityManager.createNativeQuery(sqlBuilder.toString(), Analysis.class);
    query.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
    query.setMaxResults(pageable.getPageSize());
    List<Analysis> content =query.getResultList();

    countBuilder =
        (sortField != null && (sortField.equals("finished") || sortField.equals("status"))) ?
            countBuilder.append("select count(a.*) from analyses a ")
                .append("JOIN analysis_state_journal AS journal ON journal.analysis_id = a.id ")
                .append(
                    "JOIN (SELECT analysis_id, max(date) AS finished FROM analysis_state_journal ")
                .append(
                    "GROUP BY analysis_id) AS SUB ON journal.date = SUB.finished AND journal.analysis_id=SUB.analysis_id")
            : ((sortField != null && sortField.equals("submitted")) ?
                countBuilder.append("select count(a.*) from analyses a ")
                    .append("JOIN analysis_state_journal AS journal ON journal.analysis_id = a.id ")
                    .append(
                        "JOIN (SELECT analysis_id, min(date) AS submitted FROM analysis_state_journal ")
                    .append(
                        "GROUP BY analysis_id) AS SUB ON journal.date = SUB.submitted AND journal.analysis_id=SUB.analysis_id")
                : null);
    Query countQuery = entityManager.createNativeQuery(countBuilder.toString());
    Long countResult =  ((Number)countQuery.getSingleResult()).longValue();

    return new PageImpl<>(content, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()), countResult);
  }
}

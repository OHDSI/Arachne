package com.odysseusinc.arachne.datanode.repository.implementation;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.repository.AnalysisRepositoryExtended;

@Repository
public class AnalysisRepositoryImpl implements AnalysisRepositoryExtended {
    @PersistenceContext
    private EntityManager entityManager;
    @Override
    public Page<Analysis> findAllPagingSortingByCalculateFields(String direction,
                                                                String sortField, Pageable pageable) {
        String queryString = "SELECT \n" +
                "  a.* \n" +
                "FROM \n" +
                "  analyses a \n" +
                "  JOIN analysis_state_journal AS J ON J.analysis_id = a.id \n" +
                "  JOIN (\n" +
                "    SELECT \n" +
                "      J.analysis_id, \n" +
                "      MAX(J.date) AS finished, \n" +
                "      MIN(J.date) AS submitted \n" +
                "    FROM \n" +
                "      analysis_state_journal J \n" +
                "    GROUP BY \n" +
                "      J.analysis_id\n" +
                "  ) JS ON J.analysis_id = JS.analysis_id \n" +
                "  AND J.date = JS.finished \n" +
                "ORDER BY \n";

        if(sortField.equals("finished")){
            queryString = queryString + "CASE WHEN J.state IN('EXECUTING', 'CREATED') THEN null ELSE JS.finished END ";
        }else if(sortField.equals("status")){
            queryString = queryString + "CASE WHEN J.state = 'ABORT_FAILURE' THEN 'Failed to Abort' WHEN J.state = 'EXECUTION_FAILURE' THEN 'Failed' ELSE J.state END ";
        }else if(sortField.equals("submitted")){
            queryString = queryString + "JS.submitted ";
        }
        queryString = queryString + direction + " NULLS LAST";

        Query query = entityManager.createNativeQuery(queryString, Analysis.class);
        query.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        query.setMaxResults(pageable.getPageSize());
        List<Analysis> content = query.getResultList();

        Query countQuery = entityManager.createNativeQuery("SELECT COUNT(*) FROM analyses");
        Long countResult =  ((Number)countQuery.getSingleResult()).longValue();

        return new PageImpl<>(content, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()), countResult);
    }
}
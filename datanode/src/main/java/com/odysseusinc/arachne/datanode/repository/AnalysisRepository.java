/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.repository;

import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface AnalysisRepository extends JpaRepository<Analysis, Long> {

  Optional<Analysis> findById(Long id);

  @Query(nativeQuery = true, value =
      "SELECT analyses.* FROM analyses  WHERE analyses.id = :id AND analyses.callback_password = :password")
  Optional<Analysis> findOneExecuting(@Param("id") Long id, @Param("password") String password);

  @Query(nativeQuery = true, value =
      "SELECT analyses.* "
          + "FROM analyses "
          + " JOIN analysis_state_journal AS journal ON journal.analysis_id = analyses.id "
          + " JOIN (SELECT analysis_id, max(date) AS latest FROM analysis_state_journal "
          + " GROUP BY analysis_id) AS FOO ON journal.date = FOO.latest AND journal.analysis_id=FOO.analysis_id "
          + " WHERE journal.state = :state AND analyses.central_id IS NOT NULL")
  List<Analysis> findAllByState(@Param("state") String state);

  @Query(nativeQuery = true, value =
      "SELECT analyses.* "
          + "FROM analyses "
          + " JOIN analysis_state_journal AS journal ON journal.analysis_id = analyses.id "
          + " JOIN (SELECT analysis_id, max(date) AS latest FROM analysis_state_journal "
          + " GROUP BY analysis_id) AS FOO ON journal.date = FOO.latest AND journal.analysis_id=FOO.analysis_id "
          + " WHERE journal.state NOT IN (:states)")
  List<Analysis> findAllByNotStateIn(@Param("states") List<String> states);

  @Query(nativeQuery = true, value =
      "SELECT analyses.* "
          + " FROM analyses "
          + " JOIN analysis_state_journal AS journal ON journal.analysis_id = analyses.id "
          + " JOIN (SELECT analysis_id, max(date) AS latest FROM analysis_state_journal "
          + " GROUP BY analysis_id) AS FOO ON journal.date = FOO.latest AND journal.analysis_id=FOO.analysis_id "
          + " WHERE journal.state = :state AND journal.date < :time")
  List<Analysis> findAllExecutingMoreThan(@Param("state") String state, @Param("time") Date time);

  @Query(nativeQuery = true,
      value =
          "SELECT a.* \n" +
              "FROM    analyses a \n" +
              "  JOIN analysis_state_journal AS J ON J.analysis_id = a.id\n" +
              "  JOIN (\n" +
              "          SELECT  J.analysis_id,   \n" +
              "      MAX(J.date) AS finished\n" +
              "    FROM  analysis_state_journal J\n" +
              "                GROUP BY J.analysis_id  \n" +
              "  )  JS ON J.analysis_id=JS.analysis_id and J.date = JS.finished         \n" +
              "ORDER BY CASE WHEN :direction = 'ASC' THEN\n" +
              "   CASE :sortField \n" +
              "     WHEN 'status'            THEN (CASE  WHEN J.state = 'ABORT_FAILURE' THEN 'Failed to Abort' \n"
              +
              "               WHEN J.state = 'EXECUTION_FAILURE' THEN 'Failed'\n" +
              "             ELSE J.state END )\n" +
              "     WHEN 'analysis'          THEN a.title \n" +
              "     WHEN 'study'             THEN a.study_title  \n" +
              "   END \n" +
              "  END ASC,\n" +
              "  CASE WHEN :direction = 'DESC' THEN\n" +
              "   CASE :sortField \n" +
              "     WHEN 'status'             THEN (CASE  WHEN J.state = 'ABORT_FAILURE' THEN 'Failed to Abort' \n"
              +
              "               WHEN J.state = 'EXECUTION_FAILURE' THEN 'Failed'\n" +
              "             ELSE J.state END ) \n" +
              "     WHEN 'analysis'           THEN a.title  \n" +
              "     WHEN 'study'              THEN a.study_title  \n" +
              "   END \n" +
              "  END DESC ",
      countQuery =
          "SELECT a.* \n" +
              "FROM    analyses a \n" +
              "  JOIN analysis_state_journal AS J ON J.analysis_id = a.id\n" +
              "  JOIN (\n" +
              "          SELECT  J.analysis_id,   \n" +
              "      MAX(J.date) AS finished\n" +
              "    FROM  analysis_state_journal J\n" +
              "                GROUP BY J.analysis_id  \n" +
              "  )  JS ON J.analysis_id=JS.analysis_id and J.date = JS.finished")
  Page<Analysis> findAllPagedOrderByAnalysisStudyStatus(String direction, String sortField,
      Pageable pageable);

  @Query(nativeQuery = true, value =
      "SELECT a.* \n" +
          "FROM    analyses a \n" +
          "  JOIN analysis_state_journal AS J ON J.analysis_id = a.id\n" +
          "  JOIN (\n" +
          "   SELECT  J.analysis_id,   \n" +
          "     MAX(J.date) AS finished, \n" +
          "     MIN(J.date) AS submitted  \n" +
          "   FROM  analysis_state_journal J\n" +
          "   GROUP BY J.analysis_id  \n" +
          "  )  JS ON J.analysis_id=JS.analysis_id AND J.date = JS.finished \n" +
          "ORDER BY \n" +
          " CASE WHEN :direction = 'ASC' THEN\n" +
          "  CASE :sortField \n" +
          "   WHEN 'submitted'         THEN JS.submitted \n" +
          "   WHEN 'finished'          THEN CASE WHEN J.state IN('EXECUTING','CREATED') THEN null \n"
          +
          "           ELSE JS.finished \n" +
          "            END \n" +
          "  END \n" +
          " END ASC NULLS LAST,\n" +
          " CASE WHEN :direction = 'DESC' THEN\n" +
          "  CASE :sortField \n" +
          "   WHEN 'submitted'         THEN JS.submitted \n" +
          "   WHEN 'finished'          THEN CASE WHEN J.state IN('EXECUTING','CREATED') THEN null\n"
          +
          "           ELSE JS.finished \n" +
          "            END \n" +
          "  END \n" +
          " END DESC NULLS LAST",
      countQuery =
          "SELECT COUNT(a.*) " +
              "FROM    analyses a \n" +
              "  JOIN analysis_state_journal AS J ON J.analysis_id = a.id\n" +
              "  JOIN (\n" +
              "    SELECT  J.analysis_id,   \n" +
              "   MAX(J.date) AS finished, \n" +
              "   MIN(J.date) AS submitted  \n" +
              " FROM  analysis_state_journal J \n" +
              "    GROUP BY J.analysis_id  \n" +
              "  )  JS ON J.analysis_id=JS.analysis_id AND J.date = JS.finished ")
  Page<Analysis> findAllPagedOrderBySubmittedAndFinished(String direction, String sortField,
      Pageable pageable);
}
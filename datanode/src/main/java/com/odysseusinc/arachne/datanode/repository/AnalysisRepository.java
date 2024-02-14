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
    @Query(nativeQuery = true, value =
            "select   a.*\n" +
            "    ,JS.submitted \n" +
            "    ,JS.finished\n" +
            "    ,JS.status\n" +
            "    ,SV.id\n" +
            "from   analyses a  \n" +
            "        JOIN (\n" +
            "        SELECT   distinct analysis_id, \n" +
            "            min(date) over(partition by j.analysis_id) AS submitted, \n" +
            "            max(\n" +
            "              case j.state \n" +
            "                when 'EXECUTING' then null \n" +
            "                when 'CREATED' then null\n" +
            "                else j.date \n" +
            "              end \n" +
            "            ) over(partition by j.analysis_id) as finished,\n" +
            "            FIRST_VALUE(j.state) over(partition by j.analysis_id order by j.date desc) status\n" +
            "        FROM analysis_state_journal j\n" +
            "    ) AS JS ON a.id=JS.analysis_id\n" +
            "    LEFT JOIN (\n" +
            "      with tab as (\n" +
            "        values\n" +
            "        (CAST(1 AS int), 'ABORTED'),\n" +
            "        (CAST(2 AS int), 'ABORTING'),\n" +
            "        (CAST(3 AS int), 'CREATED'),\n" +
            "        (CAST(4 AS int), 'EXECUTED'),\n" +
            "        (CAST(5 AS int), 'EXECUTING'),\n" +
            "        (CAST(6 AS int), 'EXECUTION_FAILURE'),\n" +
            "        (CAST(7 AS int), 'ABORT_FAILURE'),\n" +
            "        (CAST(8 AS int), NULL),\n" +
            "        (CAST(9 AS int), 'DEAD')\n" +
            "      )  \n" +
            "      select column1 as id,column2 as status\n" +
            "      from tab\n" +
            "    )SV ON JS.status=SV.status\n" +
            " ORDER BY \n" +
            "     CASE WHEN :direction = 'ASC' THEN\n" +
            "            CASE :sortField \n" +
            "              WHEN 'submitted'         THEN CAST(COALESCE(JS.submitted, CAST('epoch' as timestamp)) as text)\n" +
            "              WHEN 'finished'          THEN CAST(COALESCE(JS.finished, CAST('epoch' as timestamp)) as text)\n" +
            "              WHEN 'status'            THEN CAST(SV.id as text)\n" +
            "              WHEN 'analysis'          THEN a.title \n" +
            "              WHEN 'study'             THEN a.study_title \n" +
            "              ELSE CAST(a.id as text)\n" +
            "            END \n" +
            "     END ASC,\n" +
            "     CASE WHEN :direction = 'DESC' THEN\n" +
            "            CASE :sortField \n" +
            "              WHEN 'submitted'          THEN CAST(COALESCE(JS.submitted, CAST('epoch' as timestamp)) as text)\n" +
            "              WHEN 'finished'           THEN CAST(COALESCE(JS.finished, CAST('epoch' as timestamp)) as text)\n" +
            "              WHEN 'status'             THEN CAST(SV.id as text)\n" +
            "              WHEN 'analysis'           THEN a.title \n" +
            "              WHEN 'study'              THEN a.study_title \n" +
            "              ELSE CAST(a.id as text)\n" +
            "            END \n" +
            "     END DESC",
            countQuery = 
                    "SELECT COUNT(a.*) " +
                    "FROM   analyses a  \n" +
                    "        JOIN (\n" +
                    "        SELECT   distinct analysis_id, \n" +
                    "            min(date) over(partition by j.analysis_id) AS submitted, \n" +
                    "            max(\n" +
                    "              case j.state \n" +
                    "                when 'EXECUTING' then null \n" +
                    "                when 'CREATED' then null\n" +
                    "                else j.date \n" +
                    "              end \n" +
                    "            ) over(partition by j.analysis_id) as finished,\n" +
                    "            FIRST_VALUE(j.state) over(partition by j.analysis_id order by j.date desc) status\n" +
                    "        FROM analysis_state_journal j\n" +
                    "    ) AS JS ON a.id=JS.analysis_id")
    Page<Analysis> findAllPagedOrderByCustomFields(String direction,String sortField,Pageable pageable);

}

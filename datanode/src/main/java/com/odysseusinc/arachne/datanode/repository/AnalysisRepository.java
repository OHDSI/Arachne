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
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface AnalysisRepository extends JpaRepository<Analysis, Long>,
    AnalysisRepositoryExtended {

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

}
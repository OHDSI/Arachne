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

import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * @deprecated use EntityManager instead
 */
@Deprecated
public interface AnalysisStateJournalRepository extends JpaRepository<AnalysisStateEntry, Long> {
    @Deprecated
    @Query(value =
            " SELECT journal.* FROM analysis_state_journal AS journal "
                    + " JOIN (SELECT analysis_id, max(date) AS latest FROM analysis_state_journal "
                    + " GROUP BY analysis_id) AS FOO ON journal.date = FOO.latest AND journal.analysis_id=FOO.analysis_id "
                    + " WHERE journal.analysis_Id = :id",
            nativeQuery = true)
    Optional<AnalysisStateEntry> findLatestByAnalysisId(@Param("id") Long analysisId);
}

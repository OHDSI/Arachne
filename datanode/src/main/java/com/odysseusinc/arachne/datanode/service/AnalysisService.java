/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
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
 *******************************************************************************/

package com.odysseusinc.arachne.datanode.service;

import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.user.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface AnalysisService {

    Integer invalidateAllUnfinishedAnalyses(final User user);

    com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO get(Long id);

    @Transactional
    String getStdout(Long id);

    Optional<Analysis> findAnalysis(Long id);

    void cancel(Long id, User user);

    void sendToEngine(Analysis analysis);

    Analysis persist(Analysis analysis);

    Optional<Analysis> updateStatus(Long id, String stdoutDiff, String password);

    void invalidateExecutingLong();

}

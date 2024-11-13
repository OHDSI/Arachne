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

package com.odysseusinc.arachne.datanode.dto.converters;

import com.odysseusinc.arachne.datanode.datasource.DataSourceService;
import com.odysseusinc.arachne.datanode.dto.submission.SubmissionDTO;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptor;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * @author vkoulakov
 * @since 4/12/17.
 */
@Component
public class AnalysisToSubmissionDTOConverter {

    public SubmissionDTO convert(Analysis analysis) {
        SubmissionDTO dto = new SubmissionDTO();
        dto.setAnalysis(analysis.getTitle());
        dto.setId(analysis.getId());
        dto.setOrigin(analysis.getOrigin());
        dto.setStudy(analysis.getStudyTitle());
        Optional.ofNullable(analysis.getCurrentState()).ifPresent(currentState -> {
            dto.setState(currentState.getState());
            dto.setError(currentState.getError());
            if (currentState.getState().isTerminal()) {
                dto.setFinished(currentState.getDate());
            }
        });
        // TODO: what do we expect here? Submitted to the execution engine? Or creation of submission.
        Optional.ofNullable(analysis.getInitialState()).ifPresent(initialState ->
                dto.setSubmitted(initialState.getDate())
        );
        dto.setDataSource(Optional.ofNullable(analysis.getDataSource()).map(DataSourceService::toDto).orElse(null));
        dto.setAuthor(analysis.getAuthor());
        dto.setEnvironment(getEnvironment(analysis));
        return dto;
    }

    private static String getEnvironment(Analysis analysis) {
        return Optional.ofNullable(analysis.getDockerImage()).orElseGet(() ->
                Optional.ofNullable(
                        Optional.ofNullable(analysis.getActualEnvironment()).orElseGet(analysis::getEnvironment)
                ).map(EnvironmentDescriptor::getLabel).orElse(null)
        );
    }
}

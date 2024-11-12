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
import com.odysseusinc.arachne.datanode.dto.datasource.DataSourceDTO;
import com.odysseusinc.arachne.datanode.dto.submission.SubmissionDTO;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptor;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisState;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Optional;

/**
 * @author vkoulakov
 * @since 4/12/17.
 */
@Component
public class AnalysisToSubmissionDTOConverter {
    private final static Comparator<AnalysisStateEntry> BY_DATE = Comparator.nullsFirst(Comparator.comparing(AnalysisStateEntry::getDate));

    public SubmissionDTO convert(Analysis analysis) {

        SubmissionDTO dto = new SubmissionDTO();
        dto.setAnalysis(analysis.getTitle());
        dto.setId(analysis.getId());
        dto.setOrigin(analysis.getOrigin());
        dto.setStudy(analysis.getStudyTitle());
        dto.setStage(analysis.getStage());
        dto.setError(analysis.getError());
        dto.setDataSource(Optional.ofNullable(analysis.getDataSource()).map(DataSourceService::toDto).orElse(null));
        dto.setAuthor(analysis.getAuthor());
//TODO DEV need to be revised
//        Optional.ofNullable(analysis.getStateHistory()).ifPresent(history -> {
//            history.stream().filter(entry ->
//                    entry.getDate() != null && entry.getState() != null
//            ).max(BY_DATE).ifPresent(entry -> {
//                AnalysisState state = entry.getState();
//                dto.setStatus(state.toString());
//                if (state.isTerminal()) {
//                    dto.setFinished(entry.getDate());
//                }
//            });
//            history.stream().filter(entry ->
//                    entry.getState() == AnalysisState.CREATED
//            ).findFirst().map(AnalysisStateEntry::getDate).ifPresent(dto::setSubmitted);
//        });

        String environment = Optional.ofNullable(analysis.getDockerImage()).orElseGet(() ->
                Optional.ofNullable(
                        Optional.ofNullable(analysis.getActualEnvironment()).orElseGet(analysis::getEnvironment)
                ).map(EnvironmentDescriptor::getLabel).orElse(null)
        );
        dto.setEnvironment(environment);
        return dto;
    }
}

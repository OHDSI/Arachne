/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.model.analysis;

import com.odysseusinc.arachne.datanode.converter.StringMapConverter;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptor;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultStatusDTO;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Getter
@Setter
@Entity
@Table(name = "analyses")
public class Analysis {

    @SequenceGenerator(name = "analyses_id_seq", sequenceName = "analyses_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "analyses_id_seq")
    @Id
    private Long id;
    @Column(name = "central_id")
    private Long centralId;
    @NotNull
    @Column(name = "executable_filename")
    private String executableFileName;
    @NotNull
    @Column(name = "callback_password")
    private String callbackPassword;
    @NotNull
    @Column(name = "update_status_callback")
    private String updateStatusCallback;
    @NotNull
    @Column(name = "result_callback")
    private String resultCallback;
    @NotNull
    @ManyToOne
    private DataSource dataSource;
    @Column(name = "source_folder")
    private String sourceFolder;
    @NotNull
    @Column(name = "analysis_folder")
    private String analysisFolder;

    @Column(name = "created")
    private Instant created;
    @ManyToOne
    @JoinColumn(name = "current_state_id")
    private AnalysisStateEntry currentState;

    @OneToMany(cascade = {CascadeType.ALL}, mappedBy = "analysis")
    private List<AnalysisStateEntry> stateHistory = new ArrayList<>();
    @OneToMany(cascade = {CascadeType.ALL}, mappedBy = "analysis")
    private List<AnalysisFile> analysisFiles = new ArrayList<>();
    @Column(name = "stdout")
    private String stdout;
    /**
     * @deprecated Use stage and error from currentState
     */
    @Column(name = "result_status")
    @Enumerated(value = EnumType.STRING)
    private AnalysisResultStatusDTO status;
    /**
     * @deprecated Use stage from currentState
     */
    @Column(name = "stage")
    private String stage;
    /**
     * @deprecated Use error from  currentState
     */
    @Column(name = "error")
    private String error;

    @Column(name = "title")
    private String title;
    @Column(name = "study_title")
    private String studyTitle;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "email", column = @Column(name = "author_email")),
            @AttributeOverride(name = "firstName", column = @Column(name = "author_first_name")),
            @AttributeOverride(name = "lastName", column = @Column(name = "author_last_name"))
    })
    private AnalysisAuthor author;
    @Column
    private String type;
    @Column
    @Enumerated(EnumType.STRING)
    private AnalysisOrigin origin;
    @OneToMany(cascade = {CascadeType.ALL}, mappedBy = "analysis")
    private List<AnalysisCodeFile> analysisCodeFiles = new ArrayList<>();
    @Column(name = "inner_executable_filename")
    private String innerExecutableFilename;
    @Column(name = "docker_image")
    private String dockerImage;
    @ManyToOne
    @JoinColumn(name = "environment_id")
    private EnvironmentDescriptor environment;
    @ManyToOne
    @JoinColumn(name = "actual_environment_id")
    private EnvironmentDescriptor actualEnvironment;

    /**
     * This field is just for display purposes. Use it only for showing on the UI, filtering, and sorting.
     * Don't use it in the logic!!
     */
    @Column(name = "state")
    @Enumerated(value = EnumType.STRING)
    private AnalysisState state;

    @Column(name = "parameters")
    @Convert(converter = StringMapConverter.class)
    private Map<String, String> parameters;

    public AnalysisState getState() {
        return Optional.ofNullable(state).orElse(AnalysisState.UNKNOWN);
    }

    public String getStage() {
        return Optional.ofNullable(currentState).map(AnalysisStateEntry::getStage).orElse(null);
    }

    public String getError() {
        return Optional.ofNullable(currentState).map(AnalysisStateEntry::getError).orElse(null);
    }

}

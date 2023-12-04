package com.odysseusinc.arachne.datanode.model.analysis;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptor;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultStatusDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

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
    @OneToMany(cascade = {CascadeType.ALL}, mappedBy = "analysis")
    private List<AnalysisStateEntry> stateHistory = new ArrayList<>();
    @OneToMany(cascade = {CascadeType.ALL}, mappedBy = "analysis")
    private List<AnalysisFile> analysisFiles = new ArrayList<>();
    @Column(name = "stdout")
    private String stdout;
    @Column(name = "result_status")
    @Enumerated(value = EnumType.STRING)
    private AnalysisResultStatusDTO status;
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
    @Enumerated(EnumType.STRING)
    private CommonAnalysisType type;
    @Column
    @Enumerated(EnumType.STRING)
    private AnalysisOrigin origin;
    @OneToMany(cascade = {CascadeType.ALL}, mappedBy = "analysis")
    private List<AnalysisCodeFile> analysisCodeFiles = new ArrayList<>();
    @Column(name = "inner_executable_filename")
    private String innerExecutableFilename;
    @ManyToOne
    @JoinColumn(name = "environment_id")
    private EnvironmentDescriptor environment;
    @ManyToOne
    @JoinColumn(name = "actual_environment_id")
    private EnvironmentDescriptor actualEnvironment;


}

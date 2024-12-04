package com.odysseusinc.arachne;

import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.datanode.util.Fn;
import com.odysseusinc.arachne.ee.Analysis;
import com.odysseusinc.arachne.ee.ExecutionEngine;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestTypeDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.ExecutionOutcome;
import com.odysseusinc.arachne.execution_engine_common.descriptor.dto.DockerEnvironmentDTO;
import com.odysseusinc.arachne.execution_engine_common.descriptor.dto.TarballEnvironmentDTO;
import org.apache.commons.io.function.IOConsumer;

import java.io.OutputStream;
import java.time.Instant;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class StubExecutionEngineClient implements ExecutionEngineClient {

    private final ExecutionEngine executionEngine;

    public StubExecutionEngineClient(ExecutionEngine eeProcessor) {
        this.executionEngine = eeProcessor;
    }

    @Override
    public EngineStatus status(List<Long> ids) {
        return getEngineStatus(executionEngine.find(ids));
    }

    @Override
    public AnalysisResultDTO cancel(long id) {
        executionEngine.abort(id);
        return getAnalysisResult(executionEngine.find(id));
    }

    @Override
    public AnalysisRequestStatusDTO sendAnalysisRequest(
            AnalysisRequestDTO analysisRequest, String analysisTitle, boolean compressedResult, String name, IOConsumer<OutputStream> bodyWriter
    ) {
        executionEngine.run(analysisRequest.getId(), analysisTitle, analysisRequest.getCallbackPassword());
        return getAnalysisStatus(analysisRequest);
    }

    private AnalysisRequestStatusDTO getAnalysisStatus(AnalysisRequestDTO analysisRequest) {
        return Fn.create(AnalysisRequestStatusDTO::new, requestStatus -> {
            requestStatus.setId(analysisRequest.getId());
            requestStatus.setActualDescriptorId("test");
            requestStatus.setType(AnalysisRequestTypeDTO.R);
        });
    }

    private EngineStatus getEngineStatus(List<Analysis> analyses) {
        return Fn.create(EngineStatus::new, status -> {
            status.setStarted(Instant.now());
            status.setSubmissions(analyses.stream().collect(Collectors.toMap(
                    Analysis::getId,
                    analysis -> Fn.create(ExecutionOutcome::new, outcome -> {
                        outcome.setStage(analysis.getStage());
                        outcome.setError(analysis.getError());
                    })
            )));
            status.setEnvironments(Fn.create(EngineStatus.Environments::new, environments -> {
                environments.setTarball(Arrays.asList(
                        Fn.create(TarballEnvironmentDTO::new, tarball -> {
                            tarball.setBundleName("TarballEnv1");
                        }),
                        Fn.create(TarballEnvironmentDTO::new, tarball -> {
                            tarball.setBundleName("TarballEnv2");
                        })
                ));
                environments.setDocker(Arrays.asList(
                        Fn.create(DockerEnvironmentDTO::new, docker -> {
                            docker.setImageId("DockerEnv1");
                        }),
                        Fn.create(DockerEnvironmentDTO::new, docker -> {
                            docker.setImageId("DockerEnv2");
                        })
                ));
            }));
        });
    }

    private AnalysisResultDTO getAnalysisResult(Analysis analysis) {
        return Fn.create(AnalysisResultDTO::new, result -> {
            result.setId(analysis.getId());
            result.setStage(analysis.getStage());
            result.setRequested(new Date());
        });
    }
}

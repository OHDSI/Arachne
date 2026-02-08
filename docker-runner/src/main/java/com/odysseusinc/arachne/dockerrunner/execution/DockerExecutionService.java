/*
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
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

package com.odysseusinc.arachne.dockerrunner.execution;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.command.PullImageCmd;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.LogContainerCmd;
import com.github.dockerjava.api.command.WaitContainerResultCallback;
import com.github.dockerjava.api.exception.DockerException;
import com.github.dockerjava.api.exception.NotFoundException;
import com.github.dockerjava.api.model.AuthConfig;
import com.github.dockerjava.api.model.Frame;
import com.odysseusinc.arachne.dockerrunner.callback.CallbackClient;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestTypeDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.ExecutionOutcome;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.annotation.PreDestroy;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystems;
import java.nio.file.PathMatcher;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Service
public class DockerExecutionService {

    private static final Logger log = LoggerFactory.getLogger(DockerExecutionService.class);
    private static final String WORKDIR = "/etc/analysis";
    private static final String EXECUTION_COMMAND = "Rscript";

    private final DockerClient dockerClient;
    private final CallbackClient callbackClient;
    private final AuthConfig registryAuthConfig;

    public DockerExecutionService(DockerClient dockerClient, CallbackClient callbackClient,
                                  @Autowired(required = false) AuthConfig registryAuthConfig) {
        this.dockerClient = dockerClient;
        this.callbackClient = callbackClient;
        this.registryAuthConfig = registryAuthConfig;
    }

    @Value("${analysis.dir:/tmp/docker-runner-executions}")
    private String analysisParentDir;
    @Value("${analysis.mount:/tmp/docker-runner-executions}")
    private String analysisMount;
    @Value("${docker.image.default:r-base}")
    private String defaultImage;
    @Value("${runtime.timeOutSec:259200}")
    private int runtimeTimeoutSec;
    @Value("${runtime.killTimeoutSec:30}")
    private int killTimeoutSec;
    @Value("${submission.updateInterval:5000}")
    private int updateIntervalMs;

    private final Map<Long, RunningJob> jobs = new ConcurrentHashMap<>();
    private final ScheduledExecutorService statusScheduler = new ScheduledThreadPoolExecutor(1) {{
        setRemoveOnCancelPolicy(true);
    }};

    @Async("analysisTaskExecutor")
    public void runAsync(AnalysisRequestDTO request, File analysisDir, boolean waitCompressedResult) {
        Long id = request.getId();
        String image = request.getDockerImage() != null ? request.getDockerImage() : defaultImage;
        String script = WORKDIR + "/" + request.getExecutableFileName();
        StringBuffer stdout = new StringBuffer();

        try {
            callbackClient.sendStatus(request, Stage.INITIALIZE, "Starting execution [" + id + "] with image [" + image + "]\r\n");
            ensureImage(image, request, stdout);

            String hostPath = analysisMount + "/" + analysisDir.getName();
            List<String> env = buildEnv(request);
            CreateContainerResponse create = dockerClient.createContainerCmd(image)
                    .withHostConfig(com.github.dockerjava.api.model.HostConfig.newHostConfig()
                            .withBinds(new com.github.dockerjava.api.model.Bind(hostPath, new com.github.dockerjava.api.model.Volume(WORKDIR)))
                            .withAutoRemove(true))
                    .withEnv(env)
                    .withAttachStdout(true)
                    .withAttachStderr(true)
                    .withCmd(EXECUTION_COMMAND, script)
                    .withWorkingDir(WORKDIR)
                    .exec();
            String containerId = create.getId();
            log.info("Execution [{}] created container [{}]", id, containerId);
            callbackClient.sendStatus(request, Stage.INITIALIZE, "Container created\r\n");

            CompletableFuture<ExecutionOutcome> resultFuture = new CompletableFuture<>();
            RunningJob job = new RunningJob(request, containerId, java.time.Instant.now(), stdout, resultFuture);
            jobs.put(id, job);

            dockerClient.startContainerCmd(containerId).exec();
            callbackClient.sendStatus(request, Stage.EXECUTE, "Container started\r\n");

            // Follow logs and wait for exit in a background thread
            CompletableFuture.runAsync(() -> {
                try {
                    LogContainerCmd logCmd = dockerClient.logContainerCmd(containerId).withStdOut(true).withStdErr(true).withFollowStream(true);
                    logCmd.exec(new ResultCallback.Adapter<Frame>() {
                        @Override
                        public void onNext(Frame object) {
                            String line = new String(object.getPayload(), StandardCharsets.UTF_8);
                            stdout.append(line);
                        }
                        @Override
                        public void onError(Throwable throwable) {
                            log.debug("Execution [{}] log stream error: {}", id, throwable.getMessage());
                        }
                    });

                    Integer exitCode = dockerClient.waitContainerCmd(containerId).exec(new WaitContainerResultCallback()).awaitStatusCode(runtimeTimeoutSec, TimeUnit.SECONDS);
                    String out = stdout.toString();
                    ExecutionOutcome outcome = (exitCode != null && exitCode == 0)
                            ? new ExecutionOutcome(Stage.COMPLETED, null, out)
                            : new ExecutionOutcome(Stage.EXECUTE, "Exit code " + exitCode, out);
                    resultFuture.complete(outcome);
                } catch (Exception e) {
                    log.error("Execution [{}] failed", id, e);
                    resultFuture.complete(new ExecutionOutcome(Stage.EXECUTE, e.getMessage(), stdout.toString() + "\r\n" + ExceptionUtils.getStackTrace(e)));
                } finally {
                    jobs.remove(id);
                }
            }, statusScheduler);

            job.getResult().whenComplete((outcome, ex) -> {
                if (ex != null) {
                    outcome = new ExecutionOutcome(Stage.EXECUTE, ex.getMessage(), stdout.toString());
                }
                sendResult(request, analysisDir, outcome);
            });

            // Periodic status updates (runner stops when job is removed from map)
            statusScheduler.scheduleWithFixedDelay(() -> {
                if (jobs.containsKey(id)) {
                    callbackClient.sendStatus(request, Stage.EXECUTE, stdout.toString());
                }
            }, updateIntervalMs, updateIntervalMs, TimeUnit.MILLISECONDS);

        } catch (Exception e) {
            log.error("Execution [{}] init failed", id, e);
            jobs.remove(id);
            AnalysisResultDTO result = buildResult(request, new ExecutionOutcome(Stage.INITIALIZE, e.getMessage(), stdout + "\r\n" + ExceptionUtils.getStackTrace(e)));
            callbackClient.sendResult(request, result, null);
        }
    }

    private void ensureImage(String image, AnalysisRequestDTO request, StringBuffer stdout) {
        try {
            dockerClient.inspectImageCmd(image).exec();
            callbackClient.sendStatus(request, Stage.INITIALIZE, "Image found\r\n");
        } catch (NotFoundException e) {
            log.info("Execution [{}] pulling image [{}]", request.getId(), image);
            callbackClient.sendStatus(request, Stage.INITIALIZE, "Pulling image [" + image + "]\r\n");
            try {
                PullImageCmd pullCmd = dockerClient.pullImageCmd(image);
                if (registryAuthConfig != null) {
                    pullCmd = pullCmd.withAuthConfig(registryAuthConfig);
                }
                pullCmd.exec(new com.github.dockerjava.api.command.PullImageResultCallback()).awaitCompletion();
                callbackClient.sendStatus(request, Stage.INITIALIZE, "Pull complete\r\n");
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Pull interrupted", ie);
            }
        }
    }

    private List<String> buildEnv(AnalysisRequestDTO request) {
        List<String> env = new ArrayList<>();
        if (request.getParameters() != null) {
            for (Map.Entry<String, String> e : request.getParameters().entrySet()) {
                env.add(e.getKey() + "=" + (e.getValue() != null ? e.getValue() : ""));
            }
        }
        return env;
    }

    private void sendResult(AnalysisRequestDTO request, File analysisDir, ExecutionOutcome outcome) {
        AnalysisResultDTO result = buildResult(request, outcome);
        List<File> resultFiles = listResultFiles(analysisDir, request.getResultExclusions());
        callbackClient.sendResult(request, result, resultFiles);
    }

    private AnalysisResultDTO buildResult(AnalysisRequestDTO request, ExecutionOutcome outcome) {
        AnalysisResultDTO dto = new AnalysisResultDTO();
        dto.setId(request != null ? request.getId() : null);
        dto.setStage(outcome.getStage());
        dto.setError(outcome.getError());
        dto.setStdout(outcome.getStdout());
        if (request != null) {
            dto.setRequested(request.getRequested());
        }
        return dto;
    }

    private List<File> listResultFiles(File analysisDir, String resultExclusions) {
        PathMatcher excludeJars = FileSystems.getDefault().getPathMatcher("glob:**.jar");
        List<File> out = new ArrayList<>();
        File[] files = analysisDir.listFiles();
        if (files == null) return out;
        for (File f : files) {
            if (!f.isFile()) continue;
            if (excludeJars.matches(f.toPath())) continue;
            out.add(f);
        }
        return out;
    }

    public AnalysisRequestStatusDTO analyze(AnalysisRequestDTO request, File analysisDir, boolean waitCompressedResult) {
        Long id = request.getId();
        runAsync(request, analysisDir, waitCompressedResult);
        return new AnalysisRequestStatusDTO(id, AnalysisRequestTypeDTO.R, null);
    }

    public Optional<AnalysisResultDTO> abort(Long id) {
        RunningJob job = jobs.get(id);
        if (job == null) return Optional.empty();
        try {
            dockerClient.stopContainerCmd(job.getContainerId()).exec();
            job.getResult().complete(new ExecutionOutcome(Stage.ABORTED, null, job.getStdout().toString()));
        } catch (NotFoundException e) {
            log.info("Container [{}] already stopped", job.getContainerId());
        } catch (DockerException e) {
            log.warn("Abort container [{}] failed: {}", job.getContainerId(), e.getMessage());
        }
        jobs.remove(id);
        return Optional.of(buildResult(job.getRequest(), new ExecutionOutcome(Stage.ABORTED, null, job.getStdout().toString())));
    }

    public EngineStatus getStatus(List<Long> ids) {
        Map<Long, ExecutionOutcome> statuses = new java.util.HashMap<>();
        if (ids != null) {
            for (Long id : ids) {
                RunningJob job = jobs.get(id);
                if (job != null) {
                    statuses.put(id, job.getResult().getNow(new ExecutionOutcome(Stage.EXECUTE, null, job.getStdout().toString())));
                }
            }
        }
        return new EngineStatus(
                java.time.Instant.now(),
                statuses,
                new EngineStatus.Environments(List.of(), List.of())
        );
    }

    @PreDestroy
    public void shutdown() {
        statusScheduler.shutdown();
        try {
            statusScheduler.awaitTermination(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

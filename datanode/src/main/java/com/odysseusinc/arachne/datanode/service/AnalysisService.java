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

package com.odysseusinc.arachne.datanode.service;

import com.odysseusinc.arachne.commons.service.preprocessor.Preprocessor;
import com.odysseusinc.arachne.datanode.analysis.Upload;
import com.odysseusinc.arachne.datanode.analysis.UploadDTO;
import com.odysseusinc.arachne.datanode.analysis.UploadService;
import com.odysseusinc.arachne.datanode.controller.analysis.AnalysisCallbackController;
import com.odysseusinc.arachne.datanode.datasource.DataSourceService;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisDTO;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisDTO.Environment;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisDTO.Environment.Tarball;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptor;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptorService;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.ValidationException;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisAuthor;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisCommand;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFile;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFileStatus;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFileType;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisOrigin;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisState;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis_;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.repository.AnalysisStateJournalRepository;
import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.datanode.util.AnalysisUtils;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.util.ZipUtils;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestTypeDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class AnalysisService {
	private static final Set<String> TERMINAL_STAGES = new HashSet<>(Arrays.asList(Stage.ABORTED, Stage.COMPLETED));
	private static final List<String> STAGE_ORDER = Arrays.asList(
			Stage.INITIALIZE, Stage.EXECUTE, Stage.ABORT, Stage.ABORTED, Stage.COMPLETED
	);
	private static final Comparator<String> BY_STAGE_ORDER = Comparator.comparing(STAGE_ORDER::indexOf);

	private final ScheduledExecutorService executor = new ScheduledThreadPoolExecutor(1);
	private final Executor delayedExecutor = runnable -> executor.schedule(() -> ((Executor) ForkJoinPool.commonPool()).execute(runnable), 1, TimeUnit.SECONDS);

	@Autowired
	private UploadService uploadService;
	@Autowired
	private DataSourceService dataSourceService;
	@Autowired
	private AnalysisStateJournalRepository analysisStateJournalRepository;
	@Autowired
	private AnalysisStateService stateService;
	@Autowired
	private ExecutionEngineClient engine;
	@Value("${analysis.scheduler.invalidateExecutingInterval}")
	protected Long invalidateExecutingInterval;
	@Value("${analysis.scheduler.invalidateMaxDaysExecutingInterval}")
	protected Integer invalidateMaxDaysExecutingInterval;
	@Value("${analysis.file.maxsize}")
	protected Long maximumSize;
	@Autowired
	private EnvironmentDescriptorService environmentService;
	@Value("${submission.result.files.exclusions}")
	private String resultExclusions;
	@Value("${datanode.baseURL}")
	private String datanodeBaseURL;
	@Value("${datanode.port}")
	private String datanodePort;
	@Value("${files.store.path}")
	private String filesStorePath;
	@Autowired
	private List<Preprocessor<Analysis>> preprocessors;

    @PersistenceContext
	private EntityManager em;

	@Transactional
	public void cancel(Long id, User user) {
		Analysis analysis = find(id);
		AnalysisStateEntry state = analysis.getCurrentState();

		if (state.getCommand() == AnalysisCommand.EXECUTING || Objects.equals(state.getStage(), Stage.EXECUTE)) {
			stateService.updateState(analysis, AnalysisCommand.ABORTING, "Cancelled by [" + user.getTitle() + "]");
			executor.submit(() -> sendToEngineCancel(analysis.getId()));
		} else {
			throw new ValidationException("Analysis not running: " + id + ", current state [" + state + "]");
		}

	}

	@Transactional
	public void sendToEngineCancel(Long id) {
		Analysis analysis = find(id);
		log.info("Analysis {} [{}] cancellation attempt to send to engine", id, analysis.getTitle());
		try {
			AnalysisResultDTO result = engine.cancel(id);
			String error = result.getError();
			String stage = result.getStage();
			String stdout = result.getStdout();
			analysis.setStage(stage);
			analysis.setStdout(stdout);
			log.info("Analysis {} state after abort: [{}], errors: [{}] (stdout {} bytes)", id, stage, error, StringUtils.length(stdout));
			stateService.handleStateFromEE(analysis, stage, error);
		} catch (Exception e) {
			log.warn("Analysis {} failed to abort: {}: {}", id, e.getClass(), e.getMessage());
			log.debug(e.getMessage(), e);
			stateService.updateState(analysis, AnalysisCommand.ABORT_FAILURE, "Failed to complete termination command in Execution Engine");
		}
	}

	@Transactional
	public CompletableFuture<Long> rerun(
			Long id, com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO dto, User user
	) {
		Analysis original = find(id);
		Analysis analysis = save(dto, user, original.getSourceFolder());
		em.persist(analysis);
		stateService.updateState(analysis, AnalysisCommand.CREATED, "Rerun analysis [" + id + "] by [" + user.getTitle() + "]");
		log.info("Request [{}] sending to engine for DS [{}] (manual upload by [{}], reruns analysis {})",
				analysis.getId(), analysis.getDataSource().getId(), user.getTitle(), id
		);
		return sendToEngine(analysis);
	}

    @Transactional
    public CompletableFuture<Long> run(
			com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO dto, User user, List<MultipartFile> files
    ) {
		UploadDTO upload = uploadService.uploadFiles(user, files);
        return run(user, dto, upload.getName());
    }

    @Transactional
    public CompletableFuture<Long> run(User user, com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO dto, String uploadId) {
        Upload upload = uploadService.findUnassigned(uploadId);
        Path path = Paths.get(filesStorePath).resolve(upload.getName());
        List<Path> files = UploadService.scan(path, Function.identity());
        Analysis analysis = save(dto, user, path.toString());
        upload.setAnalysisId(analysis.getId());
        analysis.setAnalysisFiles(files.stream().filter(Files::isRegularFile).map(toAnalysisFile(analysis)).collect(Collectors.toList()));
        stateService.updateState(analysis, AnalysisCommand.CREATED, "Created by [" + user.getTitle() + "]");
        log.info("Request [{}] sending to engine for DS [{}] (manual upload by [{}])",
                analysis.getId(), analysis.getDataSource().getId(), user.getTitle()
        );
        return sendToEngine(analysis);
    }


    private CompletableFuture<Long> sendToEngine(Analysis analysis) {
		Long id = analysis.getId();
		Path path = Paths.get(analysis.getSourceFolder());

		return CompletableFuture.runAsync(
				() -> preprocess(analysis, path, id), delayedExecutor
		).thenApplyAsync(__ ->
				engine.sendAnalysisRequest(toDto(analysis), true, "request-" + id + ".zip", ZipUtils.zipDir(path)), delayedExecutor
		).handle((result, e) -> {
            if (e != null) {
                log.info("Request [{}] failed with [{}]: {}", id, e.getClass(), e.getMessage(), e);
                String reason = String.format("Execution engine request failed: %s", e.getMessage());
                stateService.updateState(analysis, AnalysisCommand.EXECUTION_FAILURE, reason);
            } else {
                afterSend(id, result);
            }
            return id;
        });
    }

    private void afterSend(Long id, AnalysisRequestStatusDTO exchange) {
        Analysis analysis = find(id);
		String descriptorId = exchange.getActualDescriptorId();
		log.info("Request [{}] of type [{}] sent successfully, descriptor in use [{}]", id, exchange.getType(), descriptorId);

		if (exchange.getType() == AnalysisRequestTypeDTO.NOT_RECOGNIZED) {
			stateService.updateState(analysis, AnalysisCommand.EXECUTION_FAILURE, "Analysis type not recognized");
		} else {
			EnvironmentDescriptor descriptor = Optional.ofNullable(analysis.getDockerImage()).map(image ->
					environmentService.ensureImageExists(image, descriptorId)
			).orElseGet(() ->
					environmentService.ensureTarballExists(descriptorId)
			);
			analysis.setActualEnvironment(descriptor);
			AnalysisStateEntry state = analysis.getCurrentState();

			// Resolution of state conflicts from concurrent changes should be implemented more reliably
            if (Optional.ofNullable(state).map(s -> s.getCommand() == AnalysisCommand.CREATED).orElse(true)) {
                String reason = String.format("Accepted by engine as %s type", exchange.getType());
                stateService.updateState(analysis, AnalysisCommand.EXECUTING, reason);
            }
		}
	}

	@Transactional
	public void update(Long id, Consumer<Analysis> updates) {
		Analysis analysis = em.find(Analysis.class, id);
		updates.accept(analysis);
	}

	@Transactional
	public void updateStatus(Long id, String password, String stage, String stdoutDiff) {
		Analysis analysis = findAnalysis(id).filter(entity ->
				Objects.equals(entity.getCallbackPassword(), password)
		).orElseThrow(() ->
				new ValidationException("Submission [" + id + "] not found or password invalid")
		);
        String currentStage = analysis.getStage();
        if (TERMINAL_STAGES.contains(currentStage)) {
			log.debug("Submission [{}] is already completed, progress update from EE ignored", id);
		} else {
            analysis.setStdout(StringUtils.join(analysis.getStdout(), stdoutDiff));
			if (BY_STAGE_ORDER.compare(currentStage, stage) < 0) {
				analysis.setStage(stage);
                stateService.handleStateFromEE(analysis, stage, null);
            }
		}
	}

	@Transactional
	public List<Long> getIncompleteIds() {
		return JpaSugar.select(em, Analysis.class, (cb, q) -> root -> {
			javax.persistence.criteria.Path<String> stage = root.get(Analysis_.stage);
			return q.where(
					cb.isNull(root.get(Analysis_.error)),
					cb.or(stage.isNull(), stage.in(Stage.EXECUTE, Stage.INITIALIZE, Stage.ABORT))
			);
		}).getResultStream().map(Analysis::getId).collect(Collectors.toList());
	}

	@Transactional
	public AnalysisDTO get(Long id) {
		Analysis analysis = find(id);
        Path sourcedir = Paths.get(analysis.getSourceFolder());
		AnalysisDTO dto = new AnalysisDTO();
		dto.setType(analysis.getType());
		dto.setDatasourceId(analysis.getDataSource().getId());
		dto.setTitle(analysis.getTitle());
		dto.setStudy(analysis.getStudyTitle());
		dto.setExecutableFileName(analysis.getExecutableFileName());
		dto.setParameters(analysis.getParameters());
        dto.setFiles(UploadService.scan(sourcedir, UploadService.toRelativePath(sourcedir)));
		String environmentId = Optional.ofNullable(analysis.getActualEnvironment()).map(EnvironmentDescriptor::getDescriptorId).orElseGet(() ->
				Optional.ofNullable(analysis.getEnvironment()).map(EnvironmentDescriptor::getDescriptorId).orElse(null)
		);
		dto.setEnvironmentId(environmentId);
		dto.setDockerImage(analysis.getDockerImage());
		Environment environment = Optional.ofNullable(analysis.getDockerImage()).map(image -> {
			Environment env = new Environment();
			String imageId = Optional.ofNullable(analysis.getActualEnvironment()).map(EnvironmentDescriptor::getDescriptorId).orElse(null);
			env.setDocker(new Environment.Docker(image, imageId));
			return env;
		}).orElseGet(() -> {
			Tarball.Actual actual = Optional.ofNullable(analysis.getActualEnvironment()).map(env ->
					new Tarball.Actual(env.getDescriptorId(), env.getLabel())
			).orElse(null);
			Environment env = new Environment();
			env.setTarball(new Tarball(environmentId, actual));
			return env;
		});
		dto.setEnvironment(environment);
		return dto;
	}

	@Transactional
	public String getStdout(Long id) {
		return find(id).getStdout();
	}

	@Transactional
	public Optional<Analysis> findAnalysis(Long id) {
		return Optional.ofNullable(em.find(Analysis.class, id));
	}

	private Analysis find(Long id) {
		return findAnalysis(id).orElseThrow(() -> new ValidationException("Analysis not found: " + id));
	}

	private Analysis save(com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO dto, User user, String sourceFolder) {
		Long datasourceId = dto.getDatasourceId();
		DataSource dataSource = dataSourceService.getById(datasourceId);
		if (Objects.isNull(dataSource)) {
			log.error("Cannot find datasource with id: {}", datasourceId);
			throw new NotExistException(DataSource.class);
		}

		String study = dto.getStudy();

		Analysis analysis = new Analysis();

		analysis.setExecutableFileName(dto.getExecutableFileName());
		analysis.setParameters(dto.getParameters());
		analysis.setSourceFolder(sourceFolder);
		// This is not used but we need to have something because not null in DB
		analysis.setAnalysisFolder(AnalysisUtils.createUniqueDir(filesStorePath).getAbsolutePath());

		analysis.setTitle(dto.getTitle());
		if (StringUtils.isNotBlank(study)) {
			analysis.setStudyTitle(study);
		}

		analysis.setType(dto.getType());

		String image = dto.getDockerImage();
		if (image == null) {
			analysis.setEnvironment(Optional.ofNullable(dto.getEnvironmentId()).flatMap(environmentService::byDescriptorId).orElse(null));
		} else {
			analysis.setDockerImage(image);
		}
		analysis.setDataSource(dataSource);

		analysis.setCallbackPassword(UUID.randomUUID().toString().replace("-", ""));
		String updateStatusCallback = String.format(
				"%s:%s%s",
				datanodeBaseURL,
				datanodePort,
				AnalysisCallbackController.UPDATE_URI
		);
		String resultCallback = String.format(
				"%s:%s%s",
				datanodeBaseURL,
				datanodePort,
				AnalysisCallbackController.RESULT_URI
		);
		analysis.setUpdateStatusCallback(updateStatusCallback);
		analysis.setResultCallback(resultCallback);

		analysis.setOrigin(AnalysisOrigin.DIRECT_UPLOAD);
		analysis.setAuthor(Optional.ofNullable(user).map(this::toAuthor).orElse(null));
        em.persist(analysis);
		return analysis;
	}

	public AnalysisAuthor toAuthor(User user) {
		AnalysisAuthor author = new AnalysisAuthor();
		author.setEmail(user.getEmail());
		author.setFirstName(user.getFirstName());
		author.setLastName(user.getLastName());
		return author;
	}

	private AnalysisRequestDTO toDto(Analysis analysis) {
		AnalysisRequestDTO dto = new AnalysisRequestDTO();
		dto.setDataSource(dataSourceService.toUnsecuredDto(analysis.getDataSource()));
		dto.setId(analysis.getId());
		dto.setExecutableFileName(analysis.getExecutableFileName());
		dto.setParameters(analysis.getParameters());;
		dto.setRequestedDescriptorId(Optional.ofNullable(analysis.getEnvironment()).map(EnvironmentDescriptor::getDescriptorId).orElse(null));
		dto.setDockerImage(analysis.getDockerImage());
		dto.setUpdateStatusCallback(analysis.getUpdateStatusCallback());
		dto.setResultCallback(analysis.getResultCallback());
		dto.setCallbackPassword(analysis.getCallbackPassword());
		dto.setRequested(new Date());
		dto.setResultExclusions(resultExclusions);
		return dto;
	}

	private void preprocess(Analysis analysis, Path path, Long id) {
		try (Stream<Path> files = Files.walk(path)) {
			files.filter(Files::isRegularFile).forEach(file ->
					preprocessors.forEach(preprocessor ->
							preprocessor.preprocess(analysis, file.toFile())
					)
			);
			log.info("Request [{}] prepared with files from [{}]", id, path);
		} catch (IOException e) {
			log.info("Request [{}] failed when running preprocessors [{}]: {}", id, e.getClass(), e.getMessage(), e);
			stateService.updateState(analysis, AnalysisState.EXECUTION_FAILURE, "Error running preprocessors: " + e.getMessage());
			throw new RuntimeException(e);
		}
	}

	private static Function<Path, AnalysisFile> toAnalysisFile(Analysis analysis) {
		return path -> {
			AnalysisFile analysisFile = new AnalysisFile();
			analysisFile.setAnalysis(analysis);
			analysisFile.setType(AnalysisFileType.ANALYSIS);
			analysisFile.setStatus(AnalysisFileStatus.UNPROCESSED);
			analysisFile.setLink(path.toAbsolutePath().toString());
			return analysisFile;
		};
	}

}

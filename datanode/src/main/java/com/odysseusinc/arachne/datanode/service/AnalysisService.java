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

import com.odysseusinc.arachne.datanode.controller.analysis.AnalysisCallbackController;
import com.odysseusinc.arachne.datanode.dto.converters.DataSourceToDataSourceUnsecuredDTOConverter;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptor;
import com.odysseusinc.arachne.datanode.environment.EnvironmentDescriptorService;
import com.odysseusinc.arachne.datanode.exception.ArachneSystemRuntimeException;
import com.odysseusinc.arachne.datanode.exception.BadRequestException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.ValidationException;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisAuthor;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFile;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFileStatus;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFileType;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisOrigin;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisState;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.repository.AnalysisRepository;
import com.odysseusinc.arachne.datanode.repository.AnalysisStateJournalRepository;
import com.odysseusinc.arachne.datanode.service.impl.AnalysisPreprocessorService;
import com.odysseusinc.arachne.datanode.service.impl.DataSourceServiceImpl;
import com.odysseusinc.arachne.datanode.util.AnalysisUtils;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.File;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
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

	private static final List<String> FINISHED_STATES = Stream.concat(
			Stream.of(AnalysisState.ABORTED),
			Stream.of(AnalysisState.values()).filter(AnalysisState::isTerminal)
	).map(AnalysisState::toString).collect(Collectors.toList());

	private final ExecutorService executor = new ThreadPoolExecutor(1, 1, 1, TimeUnit.MINUTES, new LinkedBlockingDeque<>());

	@Autowired
	private DataSourceServiceImpl dataSourceService;
	@Autowired
	private DataSourceToDataSourceUnsecuredDTOConverter datasourceConverter;
	@Autowired
	private AnalysisPreprocessorService preprocessorService;
	@Autowired
	private AnalysisRepository analysisRepository;
	@Autowired
	private AnalysisStateJournalRepository analysisStateJournalRepository;
	@Autowired
	private AnalysisStateService stateService;
	@Autowired
	private ExecutionEngineIntegrationService engineIntegrationService;
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
	private EnvironmentDescriptorService descriptorService;


	@PersistenceContext
	private EntityManager em;

	@EventListener(ApplicationReadyEvent.class)
	@Transactional
	public void init() {
		List<Analysis> closing = analysisRepository.findAllByState(AnalysisState.ABORTING.name());
		log.info("Found {} submissions pending to be aborted", closing.size());
		closing.forEach(analysis -> executor.submit(() -> sendToEngineCancel(analysis.getId())));
	}

	@Transactional
	public Integer invalidateAllUnfinishedAnalyses(final User user) {
		List<Analysis> unfinished = analysisRepository.findAllByNotStateIn(FINISHED_STATES);
		unfinished.forEach(analysis -> {
			stateService.updateState(analysis, AnalysisState.ABORTING, "Cancelled by [" + user.getTitle() + "] (mass invalidation)");
			executor.submit(() -> sendToEngineCancel(analysis.getId()));
		});
		return unfinished.size();
	}

	@Transactional
	public void cancel(Long id, User user) {
		Analysis analysis = find(id);
		AnalysisState state = analysisStateJournalRepository.findLatestByAnalysisId(analysis.getId()).orElseThrow(() ->
				new ValidationException("Analysis not running: " + id)
		).getState();
		if (state == AnalysisState.EXECUTING) {
			stateService.updateState(analysis, AnalysisState.ABORTING, "Cancelled by [" + user.getTitle() + "]");
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
			AnalysisResultDTO result = engineIntegrationService.sendCancel(id);
			String error = result.getError();
			String stage = result.getStage();
			String stdout = result.getStdout();
			analysis.setStage(stage);
			analysis.setError(error);
			analysis.setStdout(stdout);
			log.info("Analysis {} state after abort: [{}], errors: [{}] (stdout {} bytes)", id, stage, error, StringUtils.length(stdout));
			stateService.handleStateFromEE(analysis, stage, error);
		} catch (Exception e) {
			log.warn("Analysis {} failed to abort: {}: {}", id, e.getClass(), e.getMessage());
			log.debug(e.getMessage(), e);
			stateService.updateState(analysis, AnalysisState.ABORT_FAILURE, "Failed to complete termination command in Execution Engine");
		}
	}

	@Transactional
	public Long rerun(
			Long id, com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO dto, User user
	) {
		Analysis original = find(id);
		Analysis analysis = toAnalysis(dto, user, original.getSourceFolder());
		analysisRepository.save(analysis);
		stateService.updateState(analysis, AnalysisState.CREATED, "Rerun analysis [" + id + "] by [" + user.getTitle() + "]");
		log.info("Request [{}] sending to engine for DS [{}] (manual upload by [{}], reruns analysis {})",
				analysis.getId(), analysis.getDataSource().getId(), user.getTitle(), id
		);
		sendToEngine(analysis);
		return analysis.getId();
	}

	@Transactional
	public Long run(
			com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO dto, User user, Consumer<File> writeFiles
	) {
		String sourceFolder = AnalysisUtils.createUniqueDir(filesStorePath).getAbsolutePath();
		Analysis analysis = toAnalysis(dto, user, sourceFolder);
		File analysisDir = new File(sourceFolder);
		writeFiles.accept(analysisDir);
		File[] filesList = analysisDir.listFiles();

		if (Objects.nonNull(filesList)) {
			List<AnalysisFile> analysisFiles = Arrays.stream(filesList)
					.filter(File::isFile)
					.map(f -> {
						AnalysisFile analysisFile = new AnalysisFile();
						analysisFile.setAnalysis(analysis);
						analysisFile.setType(AnalysisFileType.ANALYSIS);
						analysisFile.setStatus(AnalysisFileStatus.UNPROCESSED);
						analysisFile.setLink(f.getPath());
						return analysisFile;
					}).collect(Collectors.toList());
			analysis.setAnalysisFiles(analysisFiles);
		}

		analysisRepository.save(analysis);
		stateService.updateState(analysis, AnalysisState.CREATED, "Created by [" + user.getTitle() + "]");
		log.info("Request [{}] sending to engine for DS [{}] (manual upload by [{}])",
				analysis.getId(), analysis.getDataSource().getId(), user.getTitle()
		);
		sendToEngine(analysis);
		return analysis.getId();
	}

	@Async
	@Transactional
	public void sendToEngine(Analysis analysis) {

		preprocessorService.runPreprocessor(analysis);
		AnalysisRequestDTO analysisRequestDTO = toDto(analysis);
		analysisRequestDTO.setResultExclusions(resultExclusions);
		analysisRequestDTO.setDockerImage(analysis.getDockerImage());
		File analysisFolder = new File(analysis.getSourceFolder());
		Long id = analysis.getId();
		try {
			AnalysisRequestStatusDTO exchange = engineIntegrationService.sendAnalysisRequest(analysisRequestDTO, analysisFolder, true, false);
			String descriptorId = exchange.getActualDescriptorId();
			log.info("Request [{}] of type [{}] sent successfully, descriptor in use [{}]", id, exchange.getType(), descriptorId);
			analysis.setActualEnvironment(Optional.ofNullable(descriptorId).flatMap(environmentService::byDescriptorId).orElse(null));
			String reason = String.format("Accepted by engine as %s type", exchange.getType());
			stateService.updateState(analysis, AnalysisState.EXECUTING, reason);
		} catch (RestClientException | ArachneSystemRuntimeException e) {
			log.info("Request [{}] failed with [{}]: {}", id, e.getClass(), e.getMessage(), e);
			String reason = String.format("Execution engine request failed: %s", e.getMessage());
			stateService.updateState(analysis, AnalysisState.EXECUTION_FAILURE, reason);
		}
	}

	@Transactional
	public Analysis persist(Analysis analysis) {

		Analysis exists = Objects.nonNull(analysis.getId()) ? analysisRepository.getOne(analysis.getId()) : null;
		if (exists == null) {
			log.debug("Analysis with id: '{}' is not exist. Saving...", analysis.getId());
			return analysisRepository.save(analysis);
		} else {
			return exists;
		}
	}

	@Transactional
	public void updateStatus(Long id, String password, String stage, String stdoutDiff) {
		Analysis analysis = analysisRepository.findOneExecuting(id, password).orElseThrow(() ->
				new ValidationException("Submission [" + id + "] not found or password invalid")
		);
        String currentStage = analysis.getStage();
        if (TERMINAL_STAGES.contains(currentStage)) {
			log.debug("Submission [{}] is already completed, progress update from EE ignored", id);
		} else {
            analysis.setStdout(StringUtils.join(analysis.getStdout(), stdoutDiff));
			if (BY_STAGE_ORDER.compare(currentStage, stage) < 0) {
                stateService.handleStateFromEE(analysis, stage, null);
            }
		}
	}

	@Transactional
	public com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO get(Long id) {
		Analysis analysis = find(id);
		com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO dto = new com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO();
		dto.setType(analysis.getType());
		dto.setDatasourceId(analysis.getDataSource().getId());
		dto.setTitle(analysis.getTitle());
		dto.setStudy(analysis.getStudyTitle());
		dto.setExecutableFileName(analysis.getExecutableFileName());
		dto.setEnvironmentId(analysis.getEnvironment().getId());
		dto.setDockerImage(analysis.getDockerImage());
		return dto;
	}

	@Transactional
	public String getStdout(Long id) {
		return find(id).getStdout();
	}

	@Transactional
	public Optional<Analysis> findAnalysis(Long id) {

		return analysisRepository.findById(id);
	}

	private Analysis find(Long id) {
		return analysisRepository.findById(id).orElseThrow(() -> new ValidationException("Analysis not found: " + id));
	}

	private Analysis toAnalysis(com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO dto, User user, String sourceFolder) {
		Long datasourceId = dto.getDatasourceId();
		DataSource dataSource = dataSourceService.getById(datasourceId);
		if (Objects.isNull(dataSource)) {
			log.error("Cannot find datasource with id: {}", datasourceId);
			throw new NotExistException(DataSource.class);
		}

		String study = dto.getStudy();

		Analysis analysis = new Analysis();

		analysis.setExecutableFileName(dto.getExecutableFileName());
		analysis.setSourceFolder(sourceFolder);
		// This is not used but we need to have something because not null in DB
		analysis.setAnalysisFolder(AnalysisUtils.createUniqueDir(filesStorePath).getAbsolutePath());

		analysis.setTitle(dto.getTitle());
		if (StringUtils.isNotBlank(study)) {
			analysis.setStudyTitle(study);
		}

		analysis.setType(dto.getType());

		analysis.setEnvironment(Optional.ofNullable(dto.getEnvironmentId()).map(this::findEnvironment).orElse(null));
		analysis.setDockerImage(dto.getDockerImage());
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
		return analysis;
	}

	public AnalysisAuthor toAuthor(User user) {
		AnalysisAuthor author = new AnalysisAuthor();
		author.setEmail(user.getEmail());
		author.setFirstName(user.getFirstName());
		author.setLastName(user.getLastName());
		return author;
	}

	private EnvironmentDescriptor findEnvironment(Long descriptorId) {
		EnvironmentDescriptor descriptor = Optional.ofNullable(descriptorService.byId(descriptorId)).orElseThrow(() ->
				new BadRequestException("Invalid environment id: " + descriptorId)
		);
		if (descriptor.getTerminated() != null) {
			throw new BadRequestException("Invalid environment id: " + descriptorId);
		} else {
			return descriptor;
		}
	}

	private AnalysisRequestDTO toDto(Analysis analysis) {
		AnalysisRequestDTO dto = new AnalysisRequestDTO();
		dto.setDataSource(datasourceConverter.convert(analysis.getDataSource()));
		dto.setId(analysis.getId());
		dto.setExecutableFileName(analysis.getExecutableFileName());
		dto.setRequestedDescriptorId(Optional.ofNullable(analysis.getEnvironment()).map(EnvironmentDescriptor::getDescriptorId).orElse(null));
		dto.setDockerImage(analysis.getDockerImage());
		dto.setUpdateStatusCallback(analysis.getUpdateStatusCallback());
		dto.setResultCallback(analysis.getResultCallback());
		dto.setCallbackPassword(analysis.getCallbackPassword());
		dto.setRequested(new Date());
		return dto;
	}

}

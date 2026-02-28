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

package com.odysseusinc.arachne.datanode.controller.study;

import com.odysseusinc.arachne.datanode.dto.study.ConnectionCheckResultDTO;
import com.odysseusinc.arachne.datanode.dto.study.InstallStudyRequestDTO;
import com.odysseusinc.arachne.datanode.dto.study.RepositoryTagsDTO;
import com.odysseusinc.arachne.datanode.dto.study.StudyEnvironmentVariableDTO;
import com.odysseusinc.arachne.datanode.dto.study.StudyPackageDTO;
import com.odysseusinc.arachne.datanode.dto.study.StudyRepositorySettingsDTO;
import com.odysseusinc.arachne.datanode.model.study.StudyEnvironmentVariable;
import com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.model.study.StudyRun;
import com.odysseusinc.arachne.datanode.service.study.CodeFileService;
import com.odysseusinc.arachne.datanode.service.study.StudyContainerService;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryConnectionService;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryPersistenceService;
import com.odysseusinc.arachne.datanode.service.study.StudyRunResultExtractor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import com.odysseusinc.arachne.datanode.service.study.StudyContainerService.DirEntry;

@RestController
@RequestMapping(path = "/api/v1/study-repository", produces = MediaType.APPLICATION_JSON_VALUE)
public class StudyRepositoryController {

    private static final Logger LOG = LoggerFactory.getLogger(StudyRepositoryController.class);

    private final StudyRepositoryPersistenceService studyService;
    private final StudyRepositoryConnectionService connectionService;
    private final StudyContainerService containerService;
    private final CodeFileService codeFileService;

    public StudyRepositoryController(StudyRepositoryPersistenceService studyService,
                                     StudyRepositoryConnectionService connectionService,
                                     StudyContainerService containerService,
                                     CodeFileService codeFileService) {
        this.studyService = studyService;
        this.connectionService = connectionService;
        this.containerService = containerService;
        this.codeFileService = codeFileService;
    }

    @GetMapping("/packages")
    public List<StudyPackageDTO> listPackages() {
        Set<String> localImages = containerService.listLocalImageNames();
        return studyService.findAllStudyPackages().stream()
                .map(pkg -> toDTO(pkg, localImages))
                .toList();
    }

    @GetMapping("/packages/{id}")
    public StudyPackageDTO getPackage(@PathVariable Long id) {
        return studyService.findStudyPackageById(id)
                .map(pkg -> toDTO(pkg, null))
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
    }

    @PostMapping("/packages")
    @ResponseStatus(HttpStatus.CREATED)
    public StudyPackageDTO installPackage(@RequestBody InstallStudyRequestDTO request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        String version = request.getVersion() != null && !request.getVersion().isBlank()
                ? request.getVersion()
                : "latest";
        String catalogAddress = studyService.getCatalogAddress();
        if (catalogAddress == null || catalogAddress.isBlank()) {
            throw new IllegalStateException("Study catalog address is not configured. Set it in Settings.");
        }
        boolean alreadyInstalled = studyService.studyPackageExists(request.getName(), version);
        // Pull the Docker image from the registry (or refresh if already installed)
        connectionService.pullStudyImage(
                request.getName(),
                version,
                catalogAddress,
                studyService.getCatalogToken(),
                studyService.getCatalogUsername());
        if (alreadyInstalled) {
            StudyPackage pkg = studyService.findStudyPackageByNameAndVersion(request.getName(), version)
                    .orElseThrow(() -> new IllegalStateException("Study package disappeared"));
            return toDTO(pkg, null);
        }
        StudyPackage pkg = studyService.createStudyPackage(request.getName(), version, catalogAddress);
        return toDTO(pkg, null);
    }

    @PatchMapping("/packages/{id}/script")
    public StudyPackageDTO updateScript(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String script = body != null ? body.get("script") : null;
        studyService.saveStudyPackageScript(id, Objects.requireNonNullElse(script, ""));
        return studyService.findStudyPackageById(id)
                .map(pkg -> toDTO(pkg, null))
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
    }

    @DeleteMapping("/packages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePackage(@PathVariable Long id) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String containerId = pkg.getContainerId();
        if (containerId != null && !containerId.isBlank()) {
            LOG.info("Study delete: stopping Docker container for package id={}, name={}, containerId={}", id, pkg.getName(), containerId);
            containerService.stopContainer(containerId);
        }
        studyService.deleteStudyPackage(id);
    }

    @GetMapping("/settings")
    public StudyRepositorySettingsDTO getSettings() {
        StudyRepositorySettingsDTO dto = new StudyRepositorySettingsDTO();
        dto.setCatalogAddress(studyService.getCatalogAddress());
        dto.setCatalogUsername(studyService.getCatalogUsername());
        String token = studyService.getCatalogToken();
        dto.setCatalogToken(token != null && !token.isEmpty() ? "********" : "");
        return dto;
    }

    @PostMapping("/settings")
    public void saveSettings(@RequestBody StudyRepositorySettingsDTO dto) {
        String username = dto != null ? dto.getCatalogUsername() : null;
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Catalog username is required");
        }
        studyService.setCatalogSettings(
                dto != null ? dto.getCatalogAddress() : null,
                username,
                dto != null ? dto.getCatalogToken() : null);
    }

    @PostMapping("/settings/check-connection")
    public ConnectionCheckResultDTO checkConnection(@RequestBody StudyRepositorySettingsDTO dto) {
        String address = dto != null ? dto.getCatalogAddress() : null;
        String token = dto != null ? dto.getCatalogToken() : null;
        String username = dto != null ? dto.getCatalogUsername() : null;
        if (username == null || username.isBlank()) {
            return new ConnectionCheckResultDTO(false, "Catalog username is required", null, null, null);
        }
        return connectionService.checkConnection(address, token, username);
    }

    // --- Study environment variables (injected into study containers; values encrypted at rest) ---

    @GetMapping("/env-vars")
    public List<StudyEnvironmentVariableDTO> listEnvVars() {
        return studyService.findAllStudyEnvironmentVariables().stream()
                .map(StudyRepositoryController::toEnvVarDTO)
                .toList();
    }

    @GetMapping("/env-vars/{id}")
    public StudyEnvironmentVariableDTO getEnvVar(@PathVariable Long id) {
        return studyService.findStudyEnvironmentVariableById(id)
                .map(StudyRepositoryController::toEnvVarDTOWithValue)
                .orElseThrow(() -> new ResourceNotFoundException("Environment variable not found: " + id));
    }

    @PostMapping("/env-vars")
    @ResponseStatus(HttpStatus.CREATED)
    public StudyEnvironmentVariableDTO createEnvVar(@RequestBody Map<String, String> body) {
        String name = body != null ? body.get("name") : null;
        String value = body != null ? body.get("value") : null;
        StudyEnvironmentVariable created = studyService.createStudyEnvironmentVariable(name, value);
        return StudyRepositoryController.toEnvVarDTOWithValue(created);
    }

    @PutMapping("/env-vars/{id}")
    public StudyEnvironmentVariableDTO updateEnvVar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String value = body != null ? body.get("value") : null;
        StudyEnvironmentVariable updated = studyService.updateStudyEnvironmentVariable(id, value);
        return StudyRepositoryController.toEnvVarDTOWithValue(updated);
    }

    @DeleteMapping("/env-vars/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEnvVar(@PathVariable Long id) {
        studyService.deleteStudyEnvironmentVariable(id);
    }

    private static StudyEnvironmentVariableDTO toEnvVarDTO(StudyEnvironmentVariable e) {
        StudyEnvironmentVariableDTO dto = new StudyEnvironmentVariableDTO();
        dto.setId(e.getId());
        dto.setName(e.getName());
        return dto;
    }

    private static StudyEnvironmentVariableDTO toEnvVarDTOWithValue(StudyEnvironmentVariable e) {
        StudyEnvironmentVariableDTO dto = toEnvVarDTO(e);
        dto.setValue(e.getValue());
        return dto;
    }

    /**
     * Get tags for a single study (Docker repo) from the configured registry (ACR API).
     * Used to populate study versions. Example repo: "myteam/myimage".
     */
    @GetMapping("/tags")
    public RepositoryTagsDTO getRepositoryTags(
            @RequestParam String repo,
            @RequestParam(required = false, defaultValue = "100") int n) {
        if (repo == null || repo.isBlank()) {
            throw new IllegalArgumentException("repo is required");
        }
        String address = studyService.getCatalogAddress();
        String token = studyService.getCatalogToken();
        List<String> tags = connectionService.listRepositoryTags(address, token, repo.trim(), n);
        return new RepositoryTagsDTO(repo.trim(), tags);
    }

    /**
     * Open study for run: start the study Docker container (if not already running).
     * DB-backed codeToRun.R: get or seed from image into DB, sync to container /workspace, return content.
     */
    @PostMapping("/packages/{id}/start")
    public Map<String, Object> startStudy(@PathVariable Long id) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String containerId = pkg.getContainerId();
        if (containerId != null && !containerId.isBlank() && containerService.isContainerRunning(containerId)) {
            LOG.info("Study start: reusing existing container for package id={}, containerId={}", id, containerId);
            CodeFileService.CodeFileContent code = getCodeOrFromContainer(id, pkg, containerId);
            try {
                codeFileService.syncCodeToRunningContainer(containerId, code.getContent());
            } catch (Exception e) {
                LOG.warn("Study start: could not sync code to container {}: {}", containerId, e.getMessage());
            }
            return Map.of("script", code.getContent(), "version", code.getVersion());
        }
        if (containerId != null && !containerId.isBlank()) {
            LOG.info("Study start: stopping stale container for package id={}, containerId={}", id, containerId);
            containerService.stopContainer(containerId);
            containerId = null;
        }
        String imageName = StudyContainerService.imageNameFor(
                pkg.getCatalogAddress(), pkg.getName(), pkg.getVersion());
        String resolvedImage = containerService.resolveLocalImageName(imageName);
        if (!resolvedImage.equals(imageName)) {
            LOG.info("Study start: using local image {} (requested {} not present)", resolvedImage, imageName);
        }
        LOG.info("Study start: starting Docker container for package id={}, image={}", id, resolvedImage);
        List<String> env = studyService.getStudyEnvForContainer();
        containerId = containerService.startContainer(resolvedImage, id, env);
        studyService.setStudyPackageContainerId(id, containerId);
        CodeFileService.CodeFileContent code = getCodeOrFromContainer(id, pkg, containerId);
        try {
            codeFileService.syncCodeToRunningContainer(containerId, code.getContent());
        } catch (Exception e) {
            LOG.warn("Study start: could not sync code to container {}: {}", containerId, e.getMessage());
        }
        LOG.info("Study start: container ready for package id={}, containerId={}", id, containerId);
        return Map.of("script", code.getContent(), "version", code.getVersion());
    }

    /**
     * Get DB-backed code (with seed when needed). If that fails, fall back to reading from the running container
     * so the UI still shows "ready" instead of "unavailable".
     */
    private CodeFileService.CodeFileContent getCodeOrFromContainer(Long id, StudyPackage pkg, String containerId) {
        try {
            return codeFileService.getOrSeedCodeFile(id, pkg.getVersion(),
                    CodeFileService.DEFAULT_PATH, java.util.Optional.of(containerId));
        } catch (Exception e) {
            LOG.warn("Study start: getOrSeedCodeFile failed ({}), reading from container {}", e.getMessage(), containerId);
            String script = containerService.getCodeToRunFromContainer(containerId);
            return new CodeFileService.CodeFileContent(script != null ? script : "", 0);
        }
    }

    /**
     * Stop the study container when the user closes the study or shuts it down.
     */
    @PostMapping("/packages/{id}/stop")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void stopStudy(@PathVariable Long id) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String containerId = pkg.getContainerId();
        if (containerId != null && !containerId.isBlank()) {
            LOG.info("Study stop: stopping Docker container for package id={}, name={}, containerId={}", id, pkg.getName(), containerId);
            containerService.stopContainer(containerId);
            studyService.setStudyPackageContainerId(id, null);
        }
    }

    /**
     * Get Shiny results viewer status and URL. If already running, returns url to open in browser.
     */
    @GetMapping("/packages/{id}/shiny/status")
    public Map<String, Object> getShinyStatus(@PathVariable Long id, HttpServletRequest request) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String containerId = pkg.getContainerId();
        if (containerId == null || containerId.isBlank() || !containerService.isContainerRunning(containerId)) {
            return Map.of("running", false, "url", "");
        }
        boolean running = containerService.isShinyRunning(containerId);
        String url = buildShinyUrl(request, id);
        return Map.of("running", running, "url", url != null ? url : "");
    }

    /**
     * Start the results viewer Shiny app in the study container (e.g. ExampleStudy::launchResultsExplorer(outputFolder)).
     * If already running, returns the URL without starting again. Output folder is taken from the study script (e.g. /code/output).
     */
    @PostMapping("/packages/{id}/shiny/start")
    public Map<String, Object> startShiny(@PathVariable Long id, HttpServletRequest request) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String containerId = pkg.getContainerId();
        if (containerId == null || containerId.isBlank()) {
            throw new IllegalStateException("Study container is not running. Open the study first.");
        }
        if (!containerService.isContainerRunning(containerId)) {
            throw new IllegalStateException("Study container is no longer running. Open the study again.");
        }
        boolean alreadyRunning = containerService.isShinyRunning(containerId);
        if (!alreadyRunning) {
            String script = pkg.getScript() != null ? pkg.getScript() : "";
            String outputFolderName = StudyContainerService.parseOutputFolderFromScript(script);
            String outputFolderPath = StudyContainerService.STUDY_WORKDIR + "/" + outputFolderName;
            containerService.startShinyApp(containerId, outputFolderPath);
        }
        String url = buildShinyUrl(request, id);
        return Map.of("url", url != null ? url : "", "running", true);
    }

    /**
     * Stop the Shiny results viewer app in the study container.
     */
    @PostMapping("/packages/{id}/shiny/stop")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void stopShiny(@PathVariable Long id) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String containerId = pkg.getContainerId();
        if (containerId != null && !containerId.isBlank()) {
            containerService.stopShinyApp(containerId);
        }
    }

    /**
     * Get R console output from the Shiny app in the container (for debugging launch failures).
     */
    @GetMapping(value = "/packages/{id}/shiny/logs", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getShinyLogs(@PathVariable Long id) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String containerId = pkg.getContainerId();
        if (containerId == null || containerId.isBlank()) {
            return "";
        }
        return containerService.getShinyLogs(containerId);
    }

    private static String buildShinyUrl(HttpServletRequest request, long packageId) {
        String host = request.getServerName();
        int port = StudyContainerService.getShinyHostPort(packageId);
        return "http://" + host + ":" + port;
    }

    /**
     * Execute the study: run the provided R script (codeToRun.R content) inside the study container.
     * Creates a study run record, runs Rscript in the container, saves logs and execution metadata
     * (docker image, tag/version) to the database, and on success copies the output folder (from
     * outputFolder in codeToRun.R) into study_run_result_files.
     */
    @PostMapping("/packages/{id}/execute")
    public Map<String, Object> executeStudy(@PathVariable Long id, @RequestBody Map<String, String> body) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String script = body != null ? body.get("script") : null;
        if (script == null) {
            script = pkg.getScript() != null ? pkg.getScript() : "";
        }
        String containerId = pkg.getContainerId();
        if (containerId == null || containerId.isBlank()) {
            throw new IllegalStateException("Study container is not running. Open the study first.");
        }
        if (!containerService.isContainerRunning(containerId)) {
            throw new IllegalStateException("Study container is no longer running. Open the study again.");
        }
        StudyRun run = studyService.createStudyRun(id);
        String dockerImage = StudyContainerService.imageNameFor(
                pkg.getCatalogAddress(), pkg.getName(), pkg.getVersion());
        studyService.updateStudyRunDockerImage(run.getId(), dockerImage);

        String logs;
        StudyRun.StudyRunStatus status;
        try {
            logs = containerService.executeScriptInContainer(containerId, script);
            status = StudyRun.StudyRunStatus.COMPLETED;
        } catch (Exception e) {
            logs = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            status = StudyRun.StudyRunStatus.FAILED;
        }

        studyService.updateStudyRunStatus(run.getId(), status, null, logs);

        if (status == StudyRun.StudyRunStatus.COMPLETED) {
            String outputFolderName = StudyContainerService.parseOutputFolderFromScript(script);
            try (InputStream tarStream = containerService.copyOutputFolderFromContainer(containerId, outputFolderName)) {
                if (tarStream != null) {
                    var files = StudyRunResultExtractor.extractFilesFromTar(tarStream);
                    if (!files.isEmpty()) {
                        studyService.saveStudyRunResultFiles(run.getId(), files);
                        studyService.updateStudyRunStatus(run.getId(), status, outputFolderName, null);
                    }
                }
            } catch (Exception e) {
                LOG.warn("Failed to copy result folder for run {}: {}", run.getId(), e.getMessage(), e);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("runId", run.getId());
        result.put("status", status.name());
        result.put("logs", logs != null ? logs : "");
        return result;
    }

    /**
     * Get DB-backed codeToRun.R for a study (content + version for optimistic concurrency).
     * Seeds from image if not yet in DB.
     */
    @GetMapping("/packages/{id}/codeToRun")
    public Map<String, Object> getCodeToRun(@PathVariable Long id) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        CodeFileService.CodeFileContent code = codeFileService.getOrSeedCodeFile(id, pkg.getVersion(), CodeFileService.DEFAULT_PATH);
        return Map.of("content", code.getContent(), "version", code.getVersion());
    }

    /**
     * Update codeToRun.R with optimistic concurrency. Body: { "content", "version" }; image_tag inferred from study.
     * On success syncs to running container. If sync fails after DB commit, returns 502 with retry guidance.
     */
    @PutMapping("/packages/{id}/codeToRun")
    public ResponseEntity<?> putCodeToRun(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String content = body != null && body.get("content") != null ? body.get("content").toString() : "";
        int version = body != null && body.get("version") != null ? numberVersion(body.get("version")) : 0;
        int newVersion = codeFileService.updateContentIfVersionMatches(id, pkg.getVersion(), CodeFileService.DEFAULT_PATH, content, version);
        String containerId = pkg.getContainerId();
        if (containerId != null && !containerId.isBlank() && containerService.isContainerRunning(containerId)) {
            try {
                codeFileService.syncCodeToRunningContainer(containerId, content);
            } catch (Exception e) {
                LOG.warn("PUT codeToRun: DB updated but container sync failed for study {}: {}", id, e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(Map.of(
                                "message", "Content saved to database but could not update the running container. " + e.getMessage(),
                                "version", newVersion,
                                "retry", "Save again or restart the study to sync."));
            }
        }
        return ResponseEntity.ok(Map.of("content", content, "version", newVersion));
    }

    private static int numberVersion(Object v) {
        if (v instanceof Number) return ((Number) v).intValue();
        if (v instanceof String) {
            try {
                return Integer.parseInt((String) v, 10);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        return 0;
    }

    @PostMapping("/packages/{id}/runs")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> startRun(@PathVariable Long id) {
        if (studyService.findStudyPackageById(id).isEmpty()) {
            throw new ResourceNotFoundException("Study package not found: " + id);
        }
        var run = studyService.createStudyRun(id);
        return Map.of("id", run.getId());
    }

    /**
     * List directory contents inside the running study container (working dir /code).
     * Only available when the study container is running.
     */
    @GetMapping("/packages/{id}/container-files")
    public List<DirEntry> listContainerFiles(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "/code") String path) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String containerId = pkg.getContainerId();
        if (containerId == null || containerId.isBlank()) {
            throw new IllegalStateException("Study container is not running. Open the study first.");
        }
        if (!containerService.isContainerRunning(containerId)) {
            throw new IllegalStateException("Study container is no longer running. Open the study again.");
        }
        return containerService.listDirectory(containerId, path);
    }

    private static final DateTimeFormatter ISO_OFFSET = DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneOffset.UTC);

    /**
     * List study runs for a package (newest first). Used by Browse Outputs to pick a run.
     */
    @GetMapping("/packages/{packageId}/runs")
    public List<Map<String, Object>> listRuns(@PathVariable Long packageId) {
        if (studyService.findStudyPackageById(packageId).isEmpty()) {
            throw new ResourceNotFoundException("Study package not found: " + packageId);
        }
        return studyService.findStudyRunsByPackageId(packageId).stream()
                .map(run -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", run.getId());
                    m.put("status", run.getStatus().name());
                    m.put("startedAt", run.getStartedAt() != null ? ISO_OFFSET.format(run.getStartedAt()) : null);
                    m.put("finishedAt", run.getFinishedAt() != null ? ISO_OFFSET.format(run.getFinishedAt()) : null);
                    m.put("resultPath", run.getResultPath());
                    m.put("fileCount", studyService.countStudyRunResultFiles(run.getId()));
                    return m;
                })
                .collect(Collectors.toList());
    }

    /**
     * List result files (export folder contents) for a run. Paths are relative (e.g. "output/log.txt", "cohorts/summary.csv").
     */
    @GetMapping("/packages/{packageId}/runs/{runId}/result-files")
    public List<Map<String, Object>> listResultFiles(@PathVariable Long packageId, @PathVariable Long runId) {
        StudyRun run = studyService.findStudyRunById(runId)
                .orElseThrow(() -> new ResourceNotFoundException("Study run not found: " + runId));
        if (!run.getStudyPackage().getId().equals(packageId)) {
            throw new ResourceNotFoundException("Study run not found for this package");
        }
        return studyService.getStudyRunResultFiles(runId).stream()
                .map(f -> Map.<String, Object>of(
                        "filePath", f.getFilePath(),
                        "size", f.getContent() != null ? f.getContent().length : 0))
                .collect(Collectors.toList());
    }

    /**
     * Download a single result file. Path must match stored file_path (e.g. "output/log.txt").
     */
    @GetMapping(value = "/packages/{packageId}/runs/{runId}/result-files/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> downloadResultFile(
            @PathVariable Long packageId,
            @PathVariable Long runId,
            @RequestParam("path") String filePath) {
        StudyRun run = studyService.findStudyRunById(runId)
                .orElseThrow(() -> new ResourceNotFoundException("Study run not found: " + runId));
        if (!run.getStudyPackage().getId().equals(packageId)) {
            throw new ResourceNotFoundException("Study run not found for this package");
        }
        return studyService.getStudyRunResultFileContent(runId, filePath)
                .map(content -> {
                    String filename = filePath.contains("/") ? filePath.substring(filePath.lastIndexOf('/') + 1) : filePath;
                    String sanitizedFilename = filename.replaceAll("[\"\\r\\n]", "_");
                    return ResponseEntity.ok()
                            .header("Content-Disposition", "attachment; filename=\"" + sanitizedFilename + "\"")
                            .body(content);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Refresh (pull) the study image from the registry so it is available locally.
     * Use when the study is registered but the image was removed or not yet pulled.
     */
    @PostMapping("/packages/{id}/refresh")
    public StudyPackageDTO refreshPackage(@PathVariable Long id) {
        StudyPackage pkg = studyService.findStudyPackageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
        String catalogAddress = pkg.getCatalogAddress();
        if (catalogAddress == null || catalogAddress.isBlank()) {
            throw new IllegalStateException("Study catalog address is not set. Configure it in Settings.");
        }
        connectionService.pullStudyImage(
                pkg.getName(),
                pkg.getVersion(),
                catalogAddress,
                studyService.getCatalogToken(),
                studyService.getCatalogUsername());
        return toDTO(pkg, null);
    }

    private StudyPackageDTO toDTO(StudyPackage pkg, Set<String> localImages) {
        StudyPackageDTO dto = new StudyPackageDTO();
        dto.setId(pkg.getId());
        dto.setName(pkg.getName());
        dto.setVersion(pkg.getVersion());
        dto.setScript(Objects.requireNonNullElse(pkg.getScript(), ""));
        dto.setRunning(studyService.isStudyRunning(pkg.getId()));
        String containerId = pkg.getContainerId();
        dto.setLoaded(containerId != null && !containerId.isBlank() && containerService.isContainerRunning(containerId));
        dto.setHasResults(studyService.studyHasResults(pkg.getId()));
        String imageName = pkg.getCatalogAddress() != null && !pkg.getCatalogAddress().isBlank()
                ? StudyContainerService.imageNameFor(pkg.getCatalogAddress(), pkg.getName(), pkg.getVersion())
                : null;
        dto.setImageInstalled(imageName != null && (localImages != null
                ? StudyContainerService.hasRepositoryInSet(localImages, imageName)
                : containerService.hasImageLocally(imageName)));
        return dto;
    }

    // --- Code Snippets ---

    @GetMapping("/snippets")
    public List<Map<String, Object>> getCodeSnippets() {
        return studyService.findAllCodeSnippets().stream()
                .map(this::snippetToMap)
                .collect(Collectors.toList());
    }

    @PostMapping("/snippets")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createCodeSnippet(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String description = body.getOrDefault("description", "");
        String content = body.get("content");
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Snippet name is required");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Snippet content is required");
        }
        long lineCount = content.lines().count();
        if (lineCount > 100) {
            throw new IllegalArgumentException("Snippet must be 100 lines or fewer (has " + lineCount + ")");
        }
        if (studyService.codeSnippetNameExists(name)) {
            throw new IllegalArgumentException("A snippet with name '" + name + "' already exists");
        }
        return snippetToMap(studyService.createCodeSnippet(name, description, content));
    }

    @PutMapping("/snippets/{id}")
    public Map<String, Object> updateCodeSnippet(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String name = body.get("name");
        String description = body.getOrDefault("description", "");
        String content = body.get("content");
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Snippet name is required");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Snippet content is required");
        }
        long lineCount = content.lines().count();
        if (lineCount > 100) {
            throw new IllegalArgumentException("Snippet must be 100 lines or fewer (has " + lineCount + ")");
        }
        if (studyService.codeSnippetNameExistsForOther(name, id)) {
            throw new IllegalArgumentException("A snippet with name '" + name + "' already exists");
        }
        return snippetToMap(studyService.updateCodeSnippet(id, name, description, content));
    }

    @DeleteMapping("/snippets/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCodeSnippet(@PathVariable Long id) {
        studyService.deleteCodeSnippet(id);
    }

    private Map<String, Object> snippetToMap(com.odysseusinc.arachne.datanode.model.study.CodeSnippet snippet) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", snippet.getId());
        map.put("name", snippet.getName());
        map.put("description", snippet.getDescription());
        map.put("content", snippet.getContent());
        return map;
    }
}

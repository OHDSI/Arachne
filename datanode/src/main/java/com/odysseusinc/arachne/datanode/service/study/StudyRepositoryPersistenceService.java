/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.service.study;

import com.odysseusinc.arachne.datanode.model.study.CodeSnippet;
import com.odysseusinc.arachne.datanode.model.study.StudyEnvironmentVariable;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.model.study.StudyRun;
import com.odysseusinc.arachne.datanode.model.study.StudyRunResultFile;
import com.odysseusinc.arachne.datanode.repository.CodeSnippetRepository;
import com.odysseusinc.arachne.datanode.repository.StudyEnvironmentVariableRepository;
import com.odysseusinc.arachne.datanode.repository.StudyPackageRepository;
import com.odysseusinc.arachne.datanode.repository.StudyRunRepository;
import com.odysseusinc.arachne.datanode.repository.StudyRunResultFileRepository;
import com.odysseusinc.arachne.system.settings.model.SystemSetting;
import com.odysseusinc.arachne.system.settings.repository.SystemSettingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Internal service for reading and writing Study Repository persistent data.
 * No REST API; use from other backend components (e.g. runners, schedulers, or future API layer).
 */
@Service
public class StudyRepositoryPersistenceService {

    private static final String SETTING_CATALOG_ADDRESS = "study.catalog.address";
    private static final String SETTING_CATALOG_USERNAME = "study.catalog.username";
    private static final String SETTING_CATALOG_TOKEN = "study.catalog.token";

    private final StudyPackageRepository studyPackageRepository;
    private final StudyRunRepository studyRunRepository;
    private final StudyRunResultFileRepository studyRunResultFileRepository;
    private final StudyEnvironmentVariableRepository studyEnvVarRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final CodeSnippetRepository codeSnippetRepository;

    @Value("${datanode.studyRepository.defaultRegistryUrl:}")
    private String defaultRegistryUrl;
    @Value("${datanode.studyRepository.defaultRegistryUser:}")
    private String defaultRegistryUser;
    @Value("${datanode.studyRepository.defaultRegistryToken:}")
    private String defaultRegistryToken;

    /** Env var names must be valid for Docker (e.g. no = in name). */
    private static final Pattern ENV_NAME_PATTERN = Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_]*$");

    public StudyRepositoryPersistenceService(
            StudyPackageRepository studyPackageRepository,
            StudyRunRepository studyRunRepository,
            StudyRunResultFileRepository studyRunResultFileRepository,
            StudyEnvironmentVariableRepository studyEnvVarRepository,
            SystemSettingRepository systemSettingRepository,
            CodeSnippetRepository codeSnippetRepository) {
        this.studyPackageRepository = studyPackageRepository;
        this.studyRunRepository = studyRunRepository;
        this.studyRunResultFileRepository = studyRunResultFileRepository;
        this.studyEnvVarRepository = studyEnvVarRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.codeSnippetRepository = codeSnippetRepository;
    }

    // --- Study packages ---

    @Transactional(readOnly = true)
    public List<StudyPackage> findAllStudyPackages() {
        return studyPackageRepository.findAllByOrderByInstalledAtDesc();
    }

    @Transactional(readOnly = true)
    public Optional<StudyPackage> findStudyPackageById(Long id) {
        return studyPackageRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<StudyPackage> findStudyPackageByNameAndVersion(String name, String version) {
        return studyPackageRepository.findByNameAndVersion(name, version);
    }

    @Transactional(readOnly = true)
    public List<StudyPackage> findStudyPackagesByName(String name) {
        return studyPackageRepository.findByNameOrderByInstalledAtDesc(name);
    }

    /** Returns true if a package with this name and version already exists. */
    @Transactional(readOnly = true)
    public boolean studyPackageExists(String name, String version) {
        return studyPackageRepository.existsByNameAndVersion(name, version);
    }

    @Transactional
    public StudyPackage createStudyPackage(String name, String version, String catalogAddress) {
        StudyPackage pkg = new StudyPackage();
        pkg.setName(name);
        pkg.setVersion(version);
        pkg.setCatalogAddress(catalogAddress);
        Instant now = Instant.now();
        pkg.setInstalledAt(now);
        pkg.setCreatedAt(now);
        pkg.setUpdatedAt(now);
        return studyPackageRepository.save(pkg);
    }

    @Transactional
    public StudyPackage saveStudyPackage(StudyPackage studyPackage) {
        studyPackage.setUpdatedAt(Instant.now());
        return studyPackageRepository.save(studyPackage);
    }

    /** Set or clear the Docker container id for a study package (when study is opened or stopped). */
    @Transactional
    public void setStudyPackageContainerId(Long studyPackageId, String containerId) {
        studyPackageRepository.findById(studyPackageId).ifPresent(pkg -> {
            pkg.setContainerId(containerId);
            pkg.setUpdatedAt(Instant.now());
            studyPackageRepository.save(pkg);
        });
    }

    @Transactional
    public void deleteStudyPackage(Long studyPackageId) {
        studyPackageRepository.deleteById(studyPackageId);
    }

    // --- Study runs ---

    @Transactional(readOnly = true)
    public List<StudyRun> findStudyRunsByPackageId(Long studyPackageId) {
        return studyRunRepository.findByStudyPackageIdOrderByStartedAtDesc(studyPackageId);
    }

    @Transactional(readOnly = true)
    public Optional<StudyRun> findLatestRun(Long studyPackageId) {
        return studyRunRepository.findFirstByStudyPackageIdOrderByStartedAtDesc(studyPackageId);
    }

    /** True if the study has at least one completed run with a result path. */
    @Transactional(readOnly = true)
    public boolean studyHasResults(Long studyPackageId) {
        return studyRunRepository.findByStudyPackageIdOrderByStartedAtDesc(studyPackageId).stream()
                .anyMatch(r -> r.getStatus() == StudyRun.StudyRunStatus.COMPLETED && r.getResultPath() != null);
    }

    /** True if the study has at least one run in RUNNING status. */
    @Transactional(readOnly = true)
    public boolean isStudyRunning(Long studyPackageId) {
        return studyRunRepository.existsByStudyPackageIdAndStatus(studyPackageId, StudyRun.StudyRunStatus.RUNNING);
    }

    @Transactional(readOnly = true)
    public Optional<StudyRun> findStudyRunById(Long runId) {
        return studyRunRepository.findById(runId);
    }

    @Transactional
    public StudyRun createStudyRun(Long studyPackageId) {
        StudyPackage pkg = studyPackageRepository.findById(studyPackageId)
                .orElseThrow(() -> new IllegalArgumentException("Study package not found: " + studyPackageId));
        StudyRun run = new StudyRun();
        run.setStudyPackage(pkg);
        run.setStatus(StudyRun.StudyRunStatus.RUNNING);
        run.setStartedAt(Instant.now());
        return studyRunRepository.save(run);
    }

    @Transactional
    public StudyRun saveStudyRun(StudyRun run) {
        return studyRunRepository.save(run);
    }

    @Transactional
    public void updateStudyRunStatus(Long runId, StudyRun.StudyRunStatus status, String resultPath, String logs) {
        studyRunRepository.findById(runId).ifPresent(run -> {
            run.setStatus(status);
            if (resultPath != null) run.setResultPath(resultPath);
            if (logs != null) run.setLogs(logs);
            if (status == StudyRun.StudyRunStatus.COMPLETED || status == StudyRun.StudyRunStatus.FAILED || status == StudyRun.StudyRunStatus.ABORTED) {
                run.setFinishedAt(Instant.now());
            }
            studyRunRepository.save(run);
        });
    }

    /** Set the Docker image (registry/name:tag) used for this run. */
    @Transactional
    public void updateStudyRunDockerImage(Long runId, String dockerImage) {
        studyRunRepository.findById(runId).ifPresent(run -> {
            run.setDockerImage(dockerImage);
            studyRunRepository.save(run);
        });
    }

    /** Save result files for a run (from the study output folder). Replaces any existing result files for this run. */
    @Transactional
    public void saveStudyRunResultFiles(Long runId, List<Map.Entry<String, byte[]>> files) {
        if (files == null || files.isEmpty()) {
            return;
        }
        StudyRun run = studyRunRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("Study run not found: " + runId));
        studyRunResultFileRepository.deleteByStudyRunId(runId);
        for (Map.Entry<String, byte[]> e : files) {
            String filePath = e.getKey();
            if (filePath == null || filePath.length() > 2048) continue;
            StudyRunResultFile rf = new StudyRunResultFile();
            rf.setStudyRun(run);
            rf.setFilePath(filePath);
            rf.setContent(e.getValue());
            studyRunResultFileRepository.save(rf);
        }
    }

    @Transactional(readOnly = true)
    public long countStudyRunResultFiles(Long runId) {
        return studyRunResultFileRepository.countByStudyRunId(runId);
    }

    @Transactional(readOnly = true)
    public List<StudyRunResultFile> getStudyRunResultFiles(Long runId) {
        return studyRunResultFileRepository.findByStudyRunIdOrderByFilePath(runId);
    }

    @Transactional(readOnly = true)
    public java.util.Optional<byte[]> getStudyRunResultFileContent(Long runId, String filePath) {
        return studyRunResultFileRepository.findByStudyRunIdAndFilePath(runId, filePath)
                .map(StudyRunResultFile::getContent);
    }

    // --- Catalog settings (study.catalog.address, study.catalog.token) ---

    @Transactional(readOnly = true)
    public String getCatalogAddress() {
        return systemSettingRepository.findByName(SETTING_CATALOG_ADDRESS)
                .map(SystemSetting::getValue)
                .filter(v -> v != null && !v.isBlank())
                .orElseGet(() -> defaultRegistryUrl != null && !defaultRegistryUrl.isBlank() ? defaultRegistryUrl : null);
    }

    @Transactional(readOnly = true)
    public String getCatalogUsername() {
        return systemSettingRepository.findByName(SETTING_CATALOG_USERNAME)
                .map(SystemSetting::getValue)
                .filter(v -> v != null && !v.isBlank())
                .orElseGet(() -> defaultRegistryUser != null && !defaultRegistryUser.isBlank() ? defaultRegistryUser : null);
    }

    @Transactional(readOnly = true)
    public String getCatalogToken() {
        return systemSettingRepository.findByName(SETTING_CATALOG_TOKEN)
                .map(SystemSetting::getValue)
                .filter(v -> v != null && !v.isBlank())
                .orElseGet(() -> defaultRegistryToken != null && !defaultRegistryToken.isBlank() ? defaultRegistryToken : null);
    }

    @Transactional
    public void setCatalogAddress(String address) {
        setSettingValue(SETTING_CATALOG_ADDRESS, address);
    }

    @Transactional
    public void setCatalogUsername(String username) {
        setSettingValue(SETTING_CATALOG_USERNAME, username);
    }

    @Transactional
    public void setCatalogToken(String token) {
        setSettingValue(SETTING_CATALOG_TOKEN, token);
    }

    @Transactional
    public void setCatalogSettings(String address, String username, String token) {
        setCatalogAddress(address);
        setCatalogUsername(username);
        setCatalogToken(token);
    }

    private void setSettingValue(String name, String value) {
        systemSettingRepository.findByName(name).ifPresent(setting -> {
            setting.setValue(value);
            systemSettingRepository.save(setting);
        });
    }

    // --- Study environment variables (injected into study containers; values encrypted at rest) ---

    @Transactional(readOnly = true)
    public List<StudyEnvironmentVariable> findAllStudyEnvironmentVariables() {
        return studyEnvVarRepository.findAllByOrderByNameAsc();
    }

    @Transactional(readOnly = true)
    public Optional<StudyEnvironmentVariable> findStudyEnvironmentVariableById(Long id) {
        return studyEnvVarRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<StudyEnvironmentVariable> findStudyEnvironmentVariableByName(String name) {
        return studyEnvVarRepository.findByName(name);
    }

    /**
     * Returns env entries as "NAME=VALUE" for Docker container. Values are decrypted by the entity converter.
     * Names and values are sanitized (no newlines in value) so they are safe for container env.
     */
    @Transactional(readOnly = true)
    public List<String> getStudyEnvForContainer() {
        List<StudyEnvironmentVariable> vars = studyEnvVarRepository.findAllByOrderByNameAsc();
        List<String> result = new ArrayList<>();
        for (StudyEnvironmentVariable v : vars) {
            if (v.getName() == null || v.getName().isBlank()) continue;
            String name = v.getName().trim();
            if (!ENV_NAME_PATTERN.matcher(name).matches()) continue;
            String value = v.getValue() != null ? v.getValue().replace("\n", "").replace("\r", "") : "";
            result.add(name + "=" + value);
        }
        return result;
    }

    @Transactional
    public StudyEnvironmentVariable createStudyEnvironmentVariable(String name, String value) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Environment variable name is required.");
        }
        String trimmedName = name.trim();
        if (!ENV_NAME_PATTERN.matcher(trimmedName).matches()) {
            throw new IllegalArgumentException("Name must be a valid environment variable name (e.g. MY_VAR, DB_PASSWORD).");
        }
        if (studyEnvVarRepository.existsByName(trimmedName)) {
            throw new IllegalArgumentException("Environment variable already exists: " + trimmedName);
        }
        StudyEnvironmentVariable entity = new StudyEnvironmentVariable();
        entity.setName(trimmedName);
        entity.setValue(value != null ? value : "");
        Instant now = Instant.now();
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);
        return studyEnvVarRepository.save(entity);
    }

    @Transactional
    public StudyEnvironmentVariable updateStudyEnvironmentVariable(Long id, String value) {
        StudyEnvironmentVariable entity = studyEnvVarRepository.findById(id)
                .orElseThrow(() -> new com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException("Environment variable not found: " + id));
        entity.setValue(value != null ? value : "");
        entity.setUpdatedAt(Instant.now());
        return studyEnvVarRepository.save(entity);
    }

    @Transactional
    public void deleteStudyEnvironmentVariable(Long id) {
        if (!studyEnvVarRepository.existsById(id)) {
            throw new com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException("Environment variable not found: " + id);
        }
        studyEnvVarRepository.deleteById(id);
    }

    // --- Code snippets ---

    @Transactional(readOnly = true)
    public List<CodeSnippet> findAllCodeSnippets() {
        return codeSnippetRepository.findAllByOrderByNameAsc();
    }

    @Transactional(readOnly = true)
    public Optional<CodeSnippet> findCodeSnippetById(Long id) {
        return codeSnippetRepository.findById(id);
    }

    @Transactional
    public CodeSnippet createCodeSnippet(String name, String description, String content) {
        CodeSnippet snippet = new CodeSnippet();
        snippet.setName(name);
        snippet.setDescription(description);
        snippet.setContent(content);
        Instant now = Instant.now();
        snippet.setCreatedAt(now);
        snippet.setUpdatedAt(now);
        return codeSnippetRepository.save(snippet);
    }

    @Transactional
    public CodeSnippet updateCodeSnippet(Long id, String name, String description, String content) {
        CodeSnippet snippet = codeSnippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Code snippet not found: " + id));
        snippet.setName(name);
        snippet.setDescription(description);
        snippet.setContent(content);
        snippet.setUpdatedAt(Instant.now());
        return codeSnippetRepository.save(snippet);
    }

    @Transactional
    public void deleteCodeSnippet(Long id) {
        codeSnippetRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean codeSnippetNameExists(String name) {
        return codeSnippetRepository.existsByName(name);
    }

    @Transactional(readOnly = true)
    public boolean codeSnippetNameExistsForOther(String name, Long id) {
        return codeSnippetRepository.existsByNameAndIdNot(name, id);
    }
}

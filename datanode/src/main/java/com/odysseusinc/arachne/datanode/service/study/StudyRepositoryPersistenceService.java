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

import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.model.study.StudyRun;
import com.odysseusinc.arachne.datanode.repository.StudyPackageRepository;
import com.odysseusinc.arachne.datanode.repository.StudyRunRepository;
import com.odysseusinc.arachne.system.settings.model.SystemSetting;
import com.odysseusinc.arachne.system.settings.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Internal service for reading and writing Study Repository persistent data.
 * No REST API; use from other backend components (e.g. runners, schedulers, or future API layer).
 */
@Service
public class StudyRepositoryPersistenceService {

    private static final String SETTING_CATALOG_ADDRESS = "study.catalog.address";
    private static final String SETTING_CATALOG_TOKEN = "study.catalog.token";

    private final StudyPackageRepository studyPackageRepository;
    private final StudyRunRepository studyRunRepository;
    private final SystemSettingRepository systemSettingRepository;

    public StudyRepositoryPersistenceService(
            StudyPackageRepository studyPackageRepository,
            StudyRunRepository studyRunRepository,
            SystemSettingRepository systemSettingRepository) {
        this.studyPackageRepository = studyPackageRepository;
        this.studyRunRepository = studyRunRepository;
        this.systemSettingRepository = systemSettingRepository;
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

    /** Updates and persists the script for the given study package. */
    @Transactional
    public void saveStudyPackageScript(Long studyPackageId, String script) {
        studyPackageRepository.findById(studyPackageId).ifPresent(pkg -> {
            pkg.setScript(script);
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

    // --- Catalog settings (study.catalog.address, study.catalog.token) ---

    @Transactional(readOnly = true)
    public String getCatalogAddress() {
        return systemSettingRepository.findByName(SETTING_CATALOG_ADDRESS)
                .map(SystemSetting::getValue)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public String getCatalogToken() {
        return systemSettingRepository.findByName(SETTING_CATALOG_TOKEN)
                .map(SystemSetting::getValue)
                .orElse(null);
    }

    @Transactional
    public void setCatalogAddress(String address) {
        setSettingValue(SETTING_CATALOG_ADDRESS, address);
    }

    @Transactional
    public void setCatalogToken(String token) {
        setSettingValue(SETTING_CATALOG_TOKEN, token);
    }

    @Transactional
    public void setCatalogSettings(String address, String token) {
        setCatalogAddress(address);
        setCatalogToken(token);
    }

    private void setSettingValue(String name, String value) {
        systemSettingRepository.findByName(name).ifPresent(setting -> {
            setting.setValue(value);
            systemSettingRepository.save(setting);
        });
    }
}

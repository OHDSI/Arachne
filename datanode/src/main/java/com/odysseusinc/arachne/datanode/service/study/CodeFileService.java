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

package com.odysseusinc.arachne.datanode.service.study;

import com.odysseusinc.arachne.datanode.exception.ResourceConflictException;
import com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException;
import com.odysseusinc.arachne.datanode.model.study.StudyCodeFile;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.repository.StudyCodeFileRepository;
import com.odysseusinc.arachne.datanode.repository.StudyPackageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

/**
 * Service for DB-backed code files (e.g. codeToRun.R). Source of truth is Postgres;
 * content is synced to the running container's /workspace. Handles get-or-seed and
 * optimistic concurrency on update.
 */
@Service
public class CodeFileService {

    private static final Logger LOG = LoggerFactory.getLogger(CodeFileService.class);
    public static final String DEFAULT_PATH = "codeToRun.R";

    private final StudyCodeFileRepository codeFileRepository;
    private final StudyPackageRepository studyPackageRepository;
    private final StudyContainerService containerService;

    public CodeFileService(StudyCodeFileRepository codeFileRepository,
                           StudyPackageRepository studyPackageRepository,
                           StudyContainerService containerService) {
        this.codeFileRepository = codeFileRepository;
        this.studyPackageRepository = studyPackageRepository;
        this.containerService = containerService;
    }

    /**
     * Get code file content and version for (studyPackageId, imageTag, path).
     * If no row exists, seed from the image default or from the running container if provided.
     *
     * @param studyPackageId study package id
     * @param imageTag       image tag (e.g. package version)
     * @param path           file path (default codeToRun.R)
     * @param runningContainerId optional container id if the study container is already running;
     *                            when seeding, content is read from this container instead of creating a temp one
     */
    @Transactional
    public CodeFileContent getOrSeedCodeFile(Long studyPackageId, String imageTag, String path,
                                             Optional<String> runningContainerId) {
        String p = path != null && !path.isBlank() ? path.trim() : DEFAULT_PATH;
        Optional<StudyCodeFile> existing = codeFileRepository.findByStudyPackageIdAndImageTagAndPath(studyPackageId, imageTag, p);
        if (existing.isPresent()) {
            StudyCodeFile f = existing.get();
            return new CodeFileContent(f.getContent(), f.getVersion());
        }
        StudyPackage pkg = studyPackageRepository.findById(studyPackageId)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + studyPackageId));
        String defaultContent = getDefaultContentForSeed(pkg, imageTag, runningContainerId);
        StudyCodeFile newFile = new StudyCodeFile();
        newFile.setStudyPackage(pkg);
        newFile.setImageTag(imageTag);
        newFile.setPath(p);
        newFile.setContent(defaultContent != null ? defaultContent : "");
        newFile.setVersion(0);
        Instant now = Instant.now();
        newFile.setCreatedAt(now);
        newFile.setUpdatedAt(now);
        try {
            codeFileRepository.save(newFile);
        } catch (DataIntegrityViolationException e) {
            LOG.debug("Concurrent seed for study {} imageTag {} path {}; re-reading", studyPackageId, imageTag, p);
            StudyCodeFile saved = codeFileRepository.findByStudyPackageIdAndImageTagAndPath(studyPackageId, imageTag, p)
                    .orElseThrow(() -> new IllegalStateException("Code file missing after concurrent insert"));
            return new CodeFileContent(saved.getContent(), saved.getVersion());
        }
        return new CodeFileContent(newFile.getContent(), newFile.getVersion());
    }

    /**
     * Get or seed code file; no running container passed (seeding will use image via temp container).
     */
    @Transactional
    public CodeFileContent getOrSeedCodeFile(Long studyPackageId, String imageTag, String path) {
        return getOrSeedCodeFile(studyPackageId, imageTag, path, Optional.empty());
    }

    /**
     * Resolve default content when we need to seed: prefer reading from the running container
     * to avoid creating a temp container (which can fail in some Docker setups).
     */
    private String getDefaultContentForSeed(StudyPackage pkg, String imageTag,
                                            Optional<String> runningContainerId) {
        if (runningContainerId.isPresent()) {
            String cid = runningContainerId.get();
            if (cid != null && !cid.isBlank() && containerService.isContainerRunning(cid)) {
                try {
                    String fromContainer = containerService.getCodeToRunFromContainer(cid);
                    if (fromContainer != null && !fromContainer.isBlank()) {
                        return fromContainer;
                    }
                } catch (Exception e) {
                    LOG.warn("Could not read default code from running container {}: {}; falling back to image", cid, e.getMessage());
                }
            }
        }
        String imageName = StudyContainerService.imageNameFor(pkg.getCatalogAddress(), pkg.getName(), imageTag);
        try {
            return containerService.readDefaultCodeFromImage(imageName);
        } catch (Exception e) {
            LOG.warn("Could not read default code from image {}: {}", imageName, e.getMessage());
            return "";
        }
    }

    /**
     * Update content with optimistic concurrency. If version does not match, throws
     * ResourceConflictException with current version in the errors map.
     *
     * @return new version after update
     */
    @Transactional
    public int updateContentIfVersionMatches(Long studyPackageId, String imageTag, String path,
                                             String content, int version) {
        String p = path != null && !path.isBlank() ? path.trim() : DEFAULT_PATH;
        int updated = codeFileRepository.updateContentIfVersionMatches(studyPackageId, imageTag, p, content != null ? content : "", version);
        if (updated == 0) {
            StudyCodeFile current = codeFileRepository.findByStudyPackageIdAndImageTagAndPath(studyPackageId, imageTag, p)
                    .orElseThrow(() -> new ResourceNotFoundException("Code file not found for study " + studyPackageId));
            throw new ResourceConflictException("Code file was modified by another update. Refresh and try again.",
                    Map.of("version", current.getVersion()));
        }
        StudyCodeFile updatedEntity = codeFileRepository.findByStudyPackageIdAndImageTagAndPath(studyPackageId, imageTag, p)
                .orElseThrow(() -> new IllegalStateException("Code file missing after update"));
        return updatedEntity.getVersion();
    }

    /**
     * Sync content to the running container's /workspace/codeToRun.R.
     * Caller should ensure container is running; this method throws if Docker is unavailable or container invalid.
     */
    public void syncCodeToRunningContainer(String containerId, String content) {
        containerService.syncCodeToRunningContainer(containerId, content);
    }

    public static final class CodeFileContent {
        private final String content;
        private final int version;

        public CodeFileContent(String content, int version) {
            this.content = content != null ? content : "";
            this.version = version;
        }

        public String getContent() {
            return content;
        }

        public int getVersion() {
            return version;
        }
    }
}

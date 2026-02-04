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

package com.odysseusinc.arachne.datanode.controller.study;

import com.odysseusinc.arachne.datanode.dto.study.ConnectionCheckResultDTO;
import com.odysseusinc.arachne.datanode.dto.study.InstallStudyRequestDTO;
import com.odysseusinc.arachne.datanode.dto.study.RepositoryTagsDTO;
import com.odysseusinc.arachne.datanode.dto.study.StudyPackageDTO;
import com.odysseusinc.arachne.datanode.dto.study.StudyRepositorySettingsDTO;
import com.odysseusinc.arachne.datanode.exception.AlreadyExistsException;
import com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryConnectionService;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryPersistenceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping(path = "/api/v1/study-repository", produces = MediaType.APPLICATION_JSON_VALUE)
public class StudyRepositoryController {

    private final StudyRepositoryPersistenceService studyService;
    private final StudyRepositoryConnectionService connectionService;

    public StudyRepositoryController(StudyRepositoryPersistenceService studyService,
                                     StudyRepositoryConnectionService connectionService) {
        this.studyService = studyService;
        this.connectionService = connectionService;
    }

    @GetMapping("/packages")
    public List<StudyPackageDTO> listPackages() {
        return studyService.findAllStudyPackages().stream()
                .map(this::toDTO)
                .toList();
    }

    @GetMapping("/packages/{id}")
    public StudyPackageDTO getPackage(@PathVariable Long id) {
        return studyService.findStudyPackageById(id)
                .map(this::toDTO)
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
                : "1.0.0";
        String catalogAddress = studyService.getCatalogAddress();
        if (studyService.studyPackageExists(request.getName(), version)) {
            throw new AlreadyExistsException(
                    "Study package already installed: " + request.getName() + " " + version);
        }
        StudyPackage pkg = studyService.createStudyPackage(request.getName(), version, catalogAddress);
        return toDTO(pkg);
    }

    @PatchMapping("/packages/{id}/script")
    public StudyPackageDTO updateScript(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String script = body != null ? body.get("script") : null;
        studyService.saveStudyPackageScript(id, Objects.requireNonNullElse(script, ""));
        return studyService.findStudyPackageById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Study package not found: " + id));
    }

    @DeleteMapping("/packages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePackage(@PathVariable Long id) {
        if (studyService.findStudyPackageById(id).isEmpty()) {
            throw new ResourceNotFoundException("Study package not found: " + id);
        }
        studyService.deleteStudyPackage(id);
    }

    @GetMapping("/settings")
    public StudyRepositorySettingsDTO getSettings() {
        StudyRepositorySettingsDTO dto = new StudyRepositorySettingsDTO();
        dto.setCatalogAddress(studyService.getCatalogAddress());
        dto.setCatalogToken(studyService.getCatalogToken());
        return dto;
    }

    @PostMapping("/settings")
    public void saveSettings(@RequestBody StudyRepositorySettingsDTO dto) {
        studyService.setCatalogSettings(
                dto != null ? dto.getCatalogAddress() : null,
                dto != null ? dto.getCatalogToken() : null);
    }

    @PostMapping("/settings/check-connection")
    public ConnectionCheckResultDTO checkConnection(@RequestBody StudyRepositorySettingsDTO dto) {
        String address = dto != null ? dto.getCatalogAddress() : null;
        String token = dto != null ? dto.getCatalogToken() : null;
        return connectionService.checkConnection(address, token);
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

    @PostMapping("/packages/{id}/runs")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> startRun(@PathVariable Long id) {
        if (studyService.findStudyPackageById(id).isEmpty()) {
            throw new ResourceNotFoundException("Study package not found: " + id);
        }
        var run = studyService.createStudyRun(id);
        return Map.of("id", run.getId());
    }

    private StudyPackageDTO toDTO(StudyPackage pkg) {
        StudyPackageDTO dto = new StudyPackageDTO();
        dto.setId(pkg.getId());
        dto.setName(pkg.getName());
        dto.setVersion(pkg.getVersion());
        dto.setScript(Objects.requireNonNullElse(pkg.getScript(), ""));
        dto.setRunning(studyService.isStudyRunning(pkg.getId()));
        dto.setHasResults(studyService.studyHasResults(pkg.getId()));
        return dto;
    }
}

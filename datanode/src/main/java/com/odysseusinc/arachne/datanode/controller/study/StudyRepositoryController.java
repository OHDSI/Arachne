/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

package com.odysseusinc.arachne.datanode.controller.study;

import com.odysseusinc.arachne.datanode.dto.study.InstallStudyRequestDTO;
import com.odysseusinc.arachne.datanode.dto.study.StudyPackageDTO;
import com.odysseusinc.arachne.datanode.dto.study.StudyRepositorySettingsDTO;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/v1/study-repository", produces = MediaType.APPLICATION_JSON_VALUE)
public class StudyRepositoryController {

    private final StudyRepositoryPersistenceService studyService;

    public StudyRepositoryController(StudyRepositoryPersistenceService studyService) {
        this.studyService = studyService;
    }

    @GetMapping("/packages")
    public List<StudyPackageDTO> listPackages() {
        return studyService.findAllStudyPackages().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/packages/{id}")
    public StudyPackageDTO getPackage(@PathVariable Long id) {
        return studyService.findStudyPackageById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException("Study package not found: " + id));
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
            throw new com.odysseusinc.arachne.datanode.exception.AlreadyExistsException(
                    "Study package already installed: " + request.getName() + " " + version);
        }
        StudyPackage pkg = studyService.createStudyPackage(request.getName(), version, catalogAddress);
        return toDTO(pkg);
    }

    @PatchMapping("/packages/{id}/script")
    public StudyPackageDTO updateScript(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String script = body != null ? body.get("script") : null;
        studyService.saveStudyPackageScript(id, script != null ? script : "");
        return studyService.findStudyPackageById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException("Study package not found: " + id));
    }

    @DeleteMapping("/packages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePackage(@PathVariable Long id) {
        if (!studyService.findStudyPackageById(id).isPresent()) {
            throw new com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException("Study package not found: " + id);
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

    @PostMapping("/packages/{id}/runs")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> startRun(@PathVariable Long id) {
        if (!studyService.findStudyPackageById(id).isPresent()) {
            throw new com.odysseusinc.arachne.datanode.exception.ResourceNotFoundException("Study package not found: " + id);
        }
        var run = studyService.createStudyRun(id);
        return Map.of("id", run.getId());
    }

    private StudyPackageDTO toDTO(StudyPackage pkg) {
        StudyPackageDTO dto = new StudyPackageDTO();
        dto.setId(pkg.getId());
        dto.setName(pkg.getName());
        dto.setVersion(pkg.getVersion());
        dto.setScript(pkg.getScript() != null ? pkg.getScript() : "");
        dto.setRunning(studyService.isStudyRunning(pkg.getId()));
        dto.setHasResults(studyService.studyHasResults(pkg.getId()));
        return dto;
    }
}

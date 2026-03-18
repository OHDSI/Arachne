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

import com.odysseusinc.arachne.datanode.dto.study.InstallStudyRequestDTO;
import com.odysseusinc.arachne.datanode.model.study.StudyRun;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.service.study.CodeFileService;
import com.odysseusinc.arachne.datanode.service.study.StudyContainerService;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryConnectionService;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryPersistenceService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudyRepositoryControllerTest {

    @Mock
    private StudyRepositoryPersistenceService studyService;

    @Mock
    private StudyRepositoryConnectionService connectionService;

    @Mock
    private StudyContainerService containerService;

    @Mock
    private CodeFileService codeFileService;

    @Mock
    private HttpServletRequest request;

    private StudyRepositoryController controller;

    @BeforeEach
    void setUp() {
        controller = new StudyRepositoryController(studyService, connectionService, containerService, codeFileService);
    }

    @Test
    void startShiny_prefers_db_backed_code_file_over_legacy_package_script() {
        StudyPackage pkg = new StudyPackage();
        pkg.setId(42L);
        pkg.setVersion("main");
        pkg.setContainerId("container-1");

        when(studyService.findStudyPackageById(42L)).thenReturn(Optional.of(pkg));
        when(containerService.isContainerRunning("container-1")).thenReturn(true);
        when(containerService.isShinyRunning("container-1")).thenReturn(false);
        when(codeFileService.getOrSeedCodeFile(42L, "main", CodeFileService.DEFAULT_PATH))
                .thenReturn(new CodeFileService.CodeFileContent("outputFolder <- 'fresh-output'", 3));
        when(request.getServerName()).thenReturn("localhost");

        controller.startShiny(42L, request);

        verify(containerService).startShinyApp("container-1", "/code/fresh-output");
        verify(containerService, never()).startShinyApp("container-1", "/code/legacy-output");
    }

    @Test
    void startShiny_accepts_absolute_output_folder_path() {
        StudyPackage pkg = new StudyPackage();
        pkg.setId(42L);
        pkg.setVersion("main");
        pkg.setContainerId("container-1");

        when(studyService.findStudyPackageById(42L)).thenReturn(Optional.of(pkg));
        when(containerService.isContainerRunning("container-1")).thenReturn(true);
        when(containerService.isShinyRunning("container-1")).thenReturn(false);
        when(codeFileService.getOrSeedCodeFile(42L, "main", CodeFileService.DEFAULT_PATH))
                .thenReturn(new CodeFileService.CodeFileContent("outputFolder <- '/code/custom-output'", 3));
        when(request.getServerName()).thenReturn("localhost");

        controller.startShiny(42L, request);

        verify(containerService).startShinyApp("container-1", "/code/custom-output");
    }

    @Test
    void executeStudy_without_request_script_uses_db_backed_code_file() {
        StudyPackage pkg = new StudyPackage();
        pkg.setId(42L);
        pkg.setName("team/example");
        pkg.setVersion("main");
        pkg.setCatalogAddress("https://registry.example.com");
        pkg.setContainerId("container-1");

        StudyRun run = new StudyRun();
        run.setId(100L);
        run.setStartedAt(Instant.now());

        when(studyService.findStudyPackageById(42L)).thenReturn(Optional.of(pkg));
        when(containerService.isContainerRunning("container-1")).thenReturn(true);
        when(codeFileService.getOrSeedCodeFile(42L, "main", CodeFileService.DEFAULT_PATH))
                .thenReturn(new CodeFileService.CodeFileContent("outputFolder <- 'fresh-output'", 3));
        when(studyService.createStudyRun(42L)).thenReturn(run);
        when(containerService.executeScriptInContainer("container-1", "outputFolder <- 'fresh-output'"))
                .thenReturn("run completed");

        Map<String, Object> response = controller.executeStudy(42L, null);

        verify(containerService).clearOutputFolderInContainer("container-1", "fresh-output");
        verify(containerService).executeScriptInContainer("container-1", "outputFolder <- 'fresh-output'");
        verify(studyService).saveStudyRunResultFiles(eq(100L), anyList());
        verify(studyService).updateStudyRunStatus(eq(100L), eq(StudyRun.StudyRunStatus.COMPLETED), eq("fresh-output"), eq((String) response.get("logs")));
        verify(containerService, never()).executeScriptInContainer("container-1", "outputFolder <- 'legacy-output'");
        assertThat(response).containsEntry("runId", 100L);
        assertThat(response).containsEntry("status", "COMPLETED");
        assertThat((String) response.get("logs")).contains("run completed");
        assertThat((String) response.get("logs")).contains("Cleared output folder before run");
        assertThat((String) response.get("logs")).contains("Saved 0 result file(s)");
    }

    @Test
    void executeStudy_when_output_folder_clear_fails_marks_run_failed() {
        StudyPackage pkg = new StudyPackage();
        pkg.setId(42L);
        pkg.setName("team/example");
        pkg.setVersion("main");
        pkg.setCatalogAddress("https://registry.example.com");
        pkg.setContainerId("container-1");

        StudyRun run = new StudyRun();
        run.setId(101L);
        run.setStartedAt(Instant.now());

        String script = "outputFolder <- '../../tmp'";
        when(studyService.findStudyPackageById(42L)).thenReturn(Optional.of(pkg));
        when(containerService.isContainerRunning("container-1")).thenReturn(true);
        when(studyService.createStudyRun(42L)).thenReturn(run);

        Map<String, Object> response = controller.executeStudy(42L, Map.of("script", script));

        verify(containerService, never()).clearOutputFolderInContainer(eq("container-1"), anyString());
        verify(containerService, never()).executeScriptInContainer(eq("container-1"), anyString());
        verify(studyService, never()).saveStudyRunResultFiles(eq(101L), anyList());
        verify(studyService).updateStudyRunStatus(eq(101L), eq(StudyRun.StudyRunStatus.FAILED), eq(null), eq((String) response.get("logs")));
        assertThat(response).containsEntry("runId", 101L);
        assertThat(response).containsEntry("status", "FAILED");
        assertThat((String) response.get("logs")).contains("outputFolder must resolve under /code");
    }

    @Test
    void executeStudy_logs_absolute_output_folder_without_double_prefix() {
        StudyPackage pkg = new StudyPackage();
        pkg.setId(42L);
        pkg.setName("team/example");
        pkg.setVersion("main");
        pkg.setCatalogAddress("https://registry.example.com");
        pkg.setContainerId("container-1");

        StudyRun run = new StudyRun();
        run.setId(102L);
        run.setStartedAt(Instant.now());

        String script = "outputFolder <- '/code/output'";
        when(studyService.findStudyPackageById(42L)).thenReturn(Optional.of(pkg));
        when(containerService.isContainerRunning("container-1")).thenReturn(true);
        when(studyService.createStudyRun(42L)).thenReturn(run);
        when(containerService.executeScriptInContainer("container-1", script)).thenReturn("ok");

        Map<String, Object> response = controller.executeStudy(42L, Map.of("script", script));

        verify(containerService).clearOutputFolderInContainer("container-1", "/code/output");
        assertThat((String) response.get("logs")).contains("Cleared output folder before run: /code/output");
        assertThat((String) response.get("logs")).doesNotContain("/code//code/output");
    }

    @Test
    void downloadResultFile_preserves_relative_path_in_filename() {
        StudyPackage pkg = new StudyPackage();
        pkg.setId(42L);

        StudyRun run = new StudyRun();
        run.setId(100L);
        run.setStudyPackage(pkg);

        when(studyService.findStudyRunById(100L)).thenReturn(Optional.of(run));
        when(studyService.getStudyRunResultFileContent(100L, "nested/output.csv"))
                .thenReturn(Optional.of("a,b\n1,2".getBytes()));

        ResponseEntity<byte[]> response = controller.downloadResultFile(42L, 100L, "nested/output.csv");

        String disposition = response.getHeaders().getFirst("Content-Disposition");
        assertThat(disposition).contains("nested__output.csv");
    }

    @Test
    void installPackage_parses_embedded_tag_suffix() {
        InstallStudyRequestDTO request = new InstallStudyRequestDTO();
        request.setName("team/example:main");

        StudyPackage pkg = new StudyPackage();
        pkg.setId(7L);
        pkg.setName("team/example");
        pkg.setVersion("main");
        pkg.setCatalogAddress("https://registry.example.com");

        when(studyService.getCatalogAddress()).thenReturn("https://registry.example.com");
        when(studyService.studyPackageExists("team/example", "main")).thenReturn(false);
        when(studyService.createStudyPackage("team/example", "main", "https://registry.example.com"))
                .thenReturn(pkg);
        when(studyService.isStudyRunning(7L)).thenReturn(false);
        when(studyService.studyHasResults(7L)).thenReturn(false);
        when(containerService.hasImageLocally("registry.example.com/team/example:main")).thenReturn(true);

        controller.installPackage(request);

        verify(connectionService).pullStudyImage("team/example", "main", "https://registry.example.com", null, null);
    }

    @Test
    void installPackage_keeps_registry_port_in_name_when_version_is_omitted() {
        InstallStudyRequestDTO request = new InstallStudyRequestDTO();
        request.setName("localhost:5000/team/example");

        StudyPackage pkg = new StudyPackage();
        pkg.setId(8L);
        pkg.setName("localhost:5000/team/example");
        pkg.setVersion("latest");
        pkg.setCatalogAddress("https://registry.example.com");

        when(studyService.getCatalogAddress()).thenReturn("https://registry.example.com");
        when(studyService.studyPackageExists("localhost:5000/team/example", "latest")).thenReturn(false);
        when(studyService.createStudyPackage("localhost:5000/team/example", "latest", "https://registry.example.com"))
                .thenReturn(pkg);
        when(studyService.isStudyRunning(8L)).thenReturn(false);
        when(studyService.studyHasResults(8L)).thenReturn(false);
        when(containerService.hasImageLocally("registry.example.com/localhost:5000/team/example:latest")).thenReturn(false);

        controller.installPackage(request);

        verify(connectionService).pullStudyImage("localhost:5000/team/example", "latest",
                "https://registry.example.com", null, null);
    }

    @Test
    void startStudy_requires_exact_requested_image_to_be_installed() {
        StudyPackage pkg = new StudyPackage();
        pkg.setId(42L);
        pkg.setName("team/example");
        pkg.setVersion("main");
        pkg.setCatalogAddress("https://registry.example.com");

        when(studyService.findStudyPackageById(42L)).thenReturn(Optional.of(pkg));
        when(containerService.isDockerAvailable()).thenReturn(true);
        when(containerService.hasImageLocally("registry.example.com/team/example:main")).thenReturn(false);

        assertThatThrownBy(() -> controller.startStudy(42L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Click Refresh");

        verify(containerService, never()).startContainer(eq("registry.example.com/team/example:main"), eq(42L), eq(List.of()));
    }
}

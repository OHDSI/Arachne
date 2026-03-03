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

import com.odysseusinc.arachne.datanode.model.study.StudyRun;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.service.study.CodeFileService;
import com.odysseusinc.arachne.datanode.service.study.StudyContainerService;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryConnectionService;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryPersistenceService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
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

        verify(containerService).executeScriptInContainer("container-1", "outputFolder <- 'fresh-output'");
        verify(containerService, never()).executeScriptInContainer("container-1", "outputFolder <- 'legacy-output'");
        assertThat(response).containsEntry("runId", 100L);
        assertThat(response).containsEntry("status", "COMPLETED");
        assertThat(response).containsEntry("logs", "run completed");
    }
}

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

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerCmd;
import com.github.dockerjava.api.command.StartContainerCmd;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;

/**
 * Unit tests for {@link StudyContainerService}, especially starting a study Docker image.
 */
@ExtendWith(MockitoExtension.class)
class StudyContainerServiceTest {

    private static final String TEST_CONTAINER_ID = "test-container-id-123";
    private static final String TEST_IMAGE = "myregistry.azurecr.io/team/examplestudy:main";

    @Mock
    private DockerClient dockerClient;

    @Mock
    private CreateContainerCmd createContainerCmd;

    @Mock
    private StartContainerCmd startContainerCmd;

    private StudyContainerService service;

    @BeforeEach
    void setUp() {
        service = new StudyContainerService(dockerClient);
        lenient().when(dockerClient.createContainerCmd(anyString())).thenReturn(createContainerCmd);
        lenient().when(createContainerCmd.withWorkingDir(anyString())).thenReturn(createContainerCmd);
        lenient().when(createContainerCmd.withCmd(any(String[].class))).thenReturn(createContainerCmd);
        lenient().when(createContainerCmd.withName(anyString())).thenReturn(createContainerCmd);
        var createResponse = new com.github.dockerjava.api.command.CreateContainerResponse();
        createResponse.setId(TEST_CONTAINER_ID);
        lenient().when(createContainerCmd.exec()).thenReturn(createResponse);
        lenient().when(dockerClient.startContainerCmd(anyString())).thenReturn(startContainerCmd);
    }

    @Test
    void imageNameFor_builds_full_image_from_catalog_name_version() {
        assertThat(StudyContainerService.imageNameFor("https://myreg.azurecr.io", "team/study", "v1"))
                .isEqualTo("myreg.azurecr.io/team/study:v1");
        assertThat(StudyContainerService.imageNameFor("https://myreg.azurecr.io", "team/study", null))
                .isEqualTo("myreg.azurecr.io/team/study:latest");
        assertThat(StudyContainerService.imageNameFor("https://myreg.azurecr.io", "team/study", "  main  "))
                .isEqualTo("myreg.azurecr.io/team/study:main");
    }

    @Test
    void imageNameFor_accepts_bare_hostname() {
        assertThat(StudyContainerService.imageNameFor("executionengine.azurecr.io", "team/examplestudy", "main"))
                .isEqualTo("executionengine.azurecr.io/team/examplestudy:main");
    }

    @Test
    void imageNameFor_throws_when_catalog_address_invalid() {
        assertThatThrownBy(() -> StudyContainerService.imageNameFor("", "a", "b"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid catalog address");
    }

    @Test
    void startContainer_throws_when_docker_unavailable() {
        var serviceNoDocker = new StudyContainerService(null);
        assertThatThrownBy(() -> serviceNoDocker.startContainer(TEST_IMAGE))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Docker is not available");
    }

    @Test
    void startContainer_creates_and_starts_container_with_expected_image_and_workdir() {
        String containerId = service.startContainer(TEST_IMAGE);

        assertThat(containerId).isEqualTo(TEST_CONTAINER_ID);

        verify(dockerClient).createContainerCmd(TEST_IMAGE);
        ArgumentCaptor<String> workdirCaptor = ArgumentCaptor.forClass(String.class);
        verify(createContainerCmd).withWorkingDir(workdirCaptor.capture());
        assertThat(workdirCaptor.getValue()).isEqualTo(StudyContainerService.STUDY_WORKDIR);

        ArgumentCaptor<String[]> cmdCaptor = ArgumentCaptor.forClass(String[].class);
        verify(createContainerCmd).withCmd(cmdCaptor.capture());
        assertThat(cmdCaptor.getValue()).containsExactly("tail", "-f", "/dev/null");

        verify(createContainerCmd).withName(anyString());
        verify(createContainerCmd).exec();
        verify(dockerClient).startContainerCmd(TEST_CONTAINER_ID);
        verify(startContainerCmd).exec();
    }

    @Test
    void startContainer_uses_container_name_prefix_study() {
        service.startContainer(TEST_IMAGE);

        ArgumentCaptor<String> nameCaptor = ArgumentCaptor.forClass(String.class);
        verify(createContainerCmd).withName(nameCaptor.capture());
        assertThat(nameCaptor.getValue()).startsWith("study-");
    }

    @Test
    void syncCodeToRunningContainer_throws_when_docker_unavailable() {
        var serviceNoDocker = new StudyContainerService(null);
        assertThatThrownBy(() -> serviceNoDocker.syncCodeToRunningContainer("cid", "content"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Docker is not available");
    }

    @Test
    void syncCodeToRunningContainer_throws_when_containerId_blank() {
        assertThatThrownBy(() -> service.syncCodeToRunningContainer("", "content"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("containerId");
        assertThatThrownBy(() -> service.syncCodeToRunningContainer(null, "content"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("containerId");
    }
}

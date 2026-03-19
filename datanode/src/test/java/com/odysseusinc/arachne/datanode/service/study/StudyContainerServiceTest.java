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
import com.github.dockerjava.api.command.ExecCreateCmd;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.command.ExecStartCmd;
import com.github.dockerjava.api.command.InspectExecCmd;
import com.github.dockerjava.api.command.InspectExecResponse;
import com.github.dockerjava.api.command.PingCmd;
import com.github.dockerjava.api.command.StartContainerCmd;
import com.github.dockerjava.api.model.Frame;
import com.github.dockerjava.api.model.StreamType;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
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

    @Mock
    private PingCmd pingCmd;

    @Mock
    private ExecCreateCmd execCreateCmd;

    @Mock
    private ExecCreateCmdResponse execCreateCmdResponse;

    @Mock
    private ExecStartCmd execStartCmd;

    @Mock
    private InspectExecCmd inspectExecCmd;

    @Mock
    private InspectExecResponse inspectExecResponse;

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
        lenient().when(dockerClient.pingCmd()).thenReturn(pingCmd);
        lenient().doNothing().when(pingCmd).exec();
        lenient().when(dockerClient.execCreateCmd(anyString())).thenReturn(execCreateCmd);
        lenient().when(execCreateCmd.withCmd(any(String[].class))).thenReturn(execCreateCmd);
        lenient().when(execCreateCmd.withAttachStdout(true)).thenReturn(execCreateCmd);
        lenient().when(execCreateCmd.withAttachStderr(true)).thenReturn(execCreateCmd);
        lenient().when(execCreateCmd.exec()).thenReturn(execCreateCmdResponse);
        lenient().when(execCreateCmdResponse.getId()).thenReturn("exec-123");
        lenient().when(dockerClient.execStartCmd("exec-123")).thenReturn(execStartCmd);
        lenient().when(dockerClient.inspectExecCmd("exec-123")).thenReturn(inspectExecCmd);
        lenient().when(inspectExecCmd.exec()).thenReturn(inspectExecResponse);
        lenient().when(inspectExecResponse.getExitCodeLong()).thenReturn(0L);
        lenient().when(execStartCmd.exec(any())).thenAnswer(invocation -> {
            Object callback = invocation.getArgument(0);
            if (callback instanceof com.github.dockerjava.core.command.ExecStartResultCallback execCallback) {
                execCallback.onNext(new Frame(StreamType.STDOUT, "ok".getBytes()));
                execCallback.onComplete();
            }
            return callback;
        });
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
    void getShinyHostPort_uses_unique_port_per_package_id() {
        assertThat(StudyContainerService.getShinyHostPort(1L)).isEqualTo(3839);
        assertThat(StudyContainerService.getShinyHostPort(1001L)).isEqualTo(4839);
    }

    @Test
    void outputFolderPathFor_accepts_relative_and_absolute_paths_under_code() {
        assertThat(StudyContainerService.outputFolderPathFor("output"))
                .isEqualTo("/code/output");
        assertThat(StudyContainerService.outputFolderPathFor("/code/output"))
                .isEqualTo("/code/output");
        assertThat(StudyContainerService.outputFolderPathFor("nested/results"))
                .isEqualTo("/code/nested/results");
        assertThat(StudyContainerService.outputFolderPathFor("/code/a..b"))
                .isEqualTo("/code/a..b");
    }

    @Test
    void outputFolderPathFor_rejects_paths_outside_code() {
        assertThatThrownBy(() -> StudyContainerService.outputFolderPathFor("../../tmp"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("resolve under /code");
        assertThatThrownBy(() -> StudyContainerService.outputFolderPathFor("/tmp/output"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("resolve under /code");
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
    void requireDockerAvailable_throws_when_docker_client_missing() {
        var serviceNoDocker = new StudyContainerService(null);
        assertThatThrownBy(serviceNoDocker::requireDockerAvailable)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("requires Docker");
    }

    @Test
    void requireDockerAvailable_throws_when_daemon_not_reachable() {
        doThrow(new RuntimeException("cannot connect")).when(pingCmd).exec();
        assertThatThrownBy(service::requireDockerAvailable)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not reachable");
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

    @Test
    void execInContainer_returns_output_when_exit_code_zero() {
        String output = service.execInContainer("container-1", "sh", "-c", "echo ok");

        assertThat(output).contains("ok");
        verify(dockerClient).inspectExecCmd("exec-123");
    }

    @Test
    void execInContainer_throws_when_exit_code_non_zero() {
        lenient().when(inspectExecResponse.getExitCodeLong()).thenReturn(1L);

        assertThatThrownBy(() -> service.execInContainer("container-1", "sh", "-c", "exit 1"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("exit code 1")
                .hasMessageContaining("ok");
    }

    @Test
    void startShinyApp_escapes_globalenv_variable_for_shell() {
        service.startShinyApp("container-1", "/code/output");

        ArgumentCaptor<String[]> cmdCaptor = ArgumentCaptor.forClass(String[].class);
        verify(execCreateCmd).withCmd(cmdCaptor.capture());
        assertThat(cmdCaptor.getValue()).containsExactly(
                "sh",
                "-c",
                "nohup R -e \"shinySettings <- list(dataFolder='/code/output'); .GlobalEnv\\$shinySettings <- shinySettings; "
                        + "shiny::runApp(system.file('ResultsExplorer', package='ExampleStudy', mustWork=TRUE), "
                        + "host='0.0.0.0', port=3838, launch.browser=FALSE)\" >> /tmp/shiny.log 2>&1 & echo $! > /tmp/shiny.pid");
    }
}

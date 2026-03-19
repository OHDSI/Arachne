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

import com.odysseusinc.arachne.TestConfiguration;
import com.odysseusinc.arachne.datanode.LocalEnvironmentInitializer;
import com.odysseusinc.arachne.datanode.dto.study.InstallStudyRequestDTO;
import com.odysseusinc.arachne.datanode.dto.study.StudyPackageDTO;
import com.odysseusinc.arachne.datanode.model.study.StudyPackage;
import com.odysseusinc.arachne.datanode.model.study.StudyRun;
import com.odysseusinc.arachne.datanode.model.study.StudyRunResultFile;
import com.odysseusinc.arachne.datanode.service.study.StudyContainerService;
import com.odysseusinc.arachne.datanode.service.study.StudyRepositoryPersistenceService;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

@SpringBootTest(
        classes = TestConfiguration.class,
        webEnvironment = SpringBootTest.WebEnvironment.MOCK,
        properties = "spring.main.allow-bean-definition-overriding=true")
@ContextConfiguration(initializers = LocalEnvironmentInitializer.class)
@ActiveProfiles("test")
class StudyRepositoryExampleStudyE2EIT {

    private static final Logger LOG = LoggerFactory.getLogger(StudyRepositoryExampleStudyE2EIT.class);
    private static final String ENV_REGISTRY_URL = "ARACHNE_DOCKER_REGISTRY_URL";
    private static final String ENV_REGISTRY_USER = "ARACHNE_DOCKER_REGISTRY_USER";
    private static final String ENV_REGISTRY_TOKEN = "ARACHNE_DOCKER_REGISTRY_TOKEN";
    private static final String INSTALL_REPO = "darwin-eu-dev/examplestudy";
    private static final String INSTALL_VERSION = "main";

    static {
        String url = System.getenv(ENV_REGISTRY_URL);
        String user = System.getenv(ENV_REGISTRY_USER);
        String token = System.getenv(ENV_REGISTRY_TOKEN);
        if (url != null && !url.isBlank()) {
            System.setProperty("datanode.studyRepository.defaultRegistryUrl", url.trim());
        }
        if (user != null && !user.isBlank()) {
            System.setProperty("datanode.studyRepository.defaultRegistryUser", user.trim());
        }
        if (token != null && !token.isBlank()) {
            System.setProperty("datanode.studyRepository.defaultRegistryToken", token);
        }
        String dockerHost = System.getenv("DOCKER_HOST");
        if (dockerHost == null || dockerHost.isBlank() || dockerHost.contains("2375")) {
            dockerHost = defaultDockerHost();
            System.setProperty("DOCKER_HOST", dockerHost);
        }
        System.setProperty("arachne.docker.host", dockerHost);
    }

    @Autowired
    private StudyRepositoryController controller;

    @Autowired
    private StudyRepositoryPersistenceService studyService;

    @Autowired
    private StudyContainerService containerService;

    @Test
    @Timeout(value = 25, unit = TimeUnit.MINUTES)
    void runExampleStudyAndLaunchShinyFromSavedResults() throws Exception {
        String url = System.getenv(ENV_REGISTRY_URL);
        String user = System.getenv(ENV_REGISTRY_USER);
        String token = System.getenv(ENV_REGISTRY_TOKEN);

        Assumptions.assumeTrue(url != null && !url.isBlank(), ENV_REGISTRY_URL + " must be set");
        Assumptions.assumeTrue(user != null && !user.isBlank(), ENV_REGISTRY_USER + " must be set");
        Assumptions.assumeTrue(token != null && !token.isBlank(), ENV_REGISTRY_TOKEN + " must be set");
        Assumptions.assumeTrue(dockerSocketAvailable(), "Docker host is not available");

        Long packageId = null;
        try {
            studyService.setCatalogSettings(url.trim(), user.trim(), token);

            InstallStudyRequestDTO request = new InstallStudyRequestDTO();
            request.setName(INSTALL_REPO);
            request.setVersion(INSTALL_VERSION);

            StudyPackageDTO pkg = installExampleStudy(request);
            packageId = pkg.getId();

            controller.startStudy(packageId);

            String script = loadExampleStudyScript();
            assertThat(script)
                    .contains("runStudy(cdm, outputFolder)")
                    .doesNotContain("launchResultsExplorer(outputFolder)");

            Map<String, Object> runResponse = controller.executeStudy(packageId, Map.of("script", script));
            assertThat(runResponse).containsEntry("status", "COMPLETED");

            StudyRun run = studyService.findLatestRun(packageId).orElseThrow();
            assertThat(run.getStatus()).isEqualTo(StudyRun.StudyRunStatus.COMPLETED);
            assertThat(run.getResultPath()).isEqualTo("/code/output");

            List<StudyRunResultFile> resultFiles = studyService.getStudyRunResultFiles(run.getId());
            assertThat(resultFiles).isNotEmpty();
            assertThat(resultFiles)
                    .extracting(StudyRunResultFile::getFilePath)
                    .contains("log.txt", "snapshot.csv", "cohortCounts.csv");

            controller.stopStudy(packageId);

            MockHttpServletRequest shinyRequest = new MockHttpServletRequest();
            shinyRequest.setServerName("127.0.0.1");

            Map<String, Object> shinyResponse = controller.startShiny(packageId, shinyRequest);
            assertThat(shinyResponse).containsEntry("running", true);
            String shinyUrl = String.valueOf(shinyResponse.get("url"));
            assertThat(shinyUrl).startsWith("http://127.0.0.1:");

            String containerId = studyService.findStudyPackageById(packageId)
                    .map(StudyPackage::getContainerId)
                    .orElseThrow();
            assertThat(containerId).isNotBlank();

            String outputFolderPath = StudyContainerService.outputFolderPathFor(run.getResultPath());
            assertThat(containerService.listDirectory(containerId, outputFolderPath))
                    .extracting(StudyContainerService.DirEntry::getName)
                    .contains("log.txt", "snapshot.csv", "cohortCounts.csv");

            String html = waitForShinyInContainer(containerId);
            assertThat(html).containsIgnoringCase("<html");
            assertThat(containerService.getShinyLogs(containerId))
                    .contains("Listening on http://0.0.0.0:3838")
                    .doesNotContain("Could not find results data!");
        } finally {
            cleanupPackage(packageId);
        }
    }

    private StudyPackageDTO installExampleStudy(InstallStudyRequestDTO request) {
        try {
            return controller.installPackage(request);
        } catch (RuntimeException e) {
            String message = e.getMessage() != null ? e.getMessage() : "";
            Throwable cause = e.getCause();
            String causeMessage = cause != null && cause.getMessage() != null ? cause.getMessage() : "";
            boolean noSocket = message.contains("No such file or directory")
                    || causeMessage.contains("No such file or directory")
                    || message.contains("LastErrorException")
                    || causeMessage.contains("LastErrorException");
            boolean notFound = message.contains("404")
                    || causeMessage.contains("404")
                    || message.contains("not found")
                    || causeMessage.contains("not found");
            boolean noManifestForArch = message.contains("no matching manifest")
                    || causeMessage.contains("no matching manifest");
            Assumptions.assumeTrue(!noSocket, "Docker socket not available: " + message);
            Assumptions.assumeTrue(!notFound, "Example study image not found in registry: " + message);
            Assumptions.assumeTrue(!noManifestForArch, "Example study image has no manifest for this platform: " + message);
            throw e;
        }
    }

    private void cleanupPackage(Long packageId) {
        if (packageId == null) {
            return;
        }
        Optional<StudyPackage> pkg = studyService.findStudyPackageById(packageId);
        if (pkg.isEmpty()) {
            return;
        }
        try {
            controller.stopShiny(packageId);
        } catch (Exception e) {
            LOG.warn("Failed to stop Shiny for package {} during cleanup: {}", packageId, e.getMessage());
        }
        try {
            controller.deletePackage(packageId);
        } catch (Exception e) {
            LOG.warn("Failed to delete package {} during cleanup: {}", packageId, e.getMessage());
        }
    }

    private String waitForShinyInContainer(String containerId) throws Exception {
        Instant deadline = Instant.now().plus(Duration.ofMinutes(2));
        Exception lastException = null;
        while (Instant.now().isBefore(deadline)) {
            try {
                String response = containerService.execInContainer(
                        containerId,
                        "sh",
                        "-c",
                        "wget -qO- http://127.0.0.1:3838 2>/dev/null | head -n 40");
                if (response != null && response.toLowerCase().contains("<html")) {
                    return response;
                }
            } catch (RuntimeException e) {
                lastException = e;
            }
            Thread.sleep(2_000L);
        }
        String details = lastException != null ? lastException.getMessage() : "Shiny app never returned HTML from inside the container";
        String logs = containerService.getShinyLogs(containerId);
        fail("Timed out waiting for Shiny in container " + containerId + ": " + details + "\nShiny logs:\n" + logs);
        throw new IllegalStateException("unreachable");
    }

    private static boolean dockerSocketAvailable() {
        String dockerHost = System.getProperty("arachne.docker.host", System.getProperty("DOCKER_HOST", defaultDockerHost()));
        if (!dockerHost.startsWith("unix://")) {
            return true;
        }
        return Files.exists(Path.of(dockerHost.substring("unix://".length())));
    }

    private static String defaultDockerHost() {
        Path macSocket = Path.of(System.getProperty("user.home"), ".docker", "run", "docker.sock");
        if (Files.exists(macSocket)) {
            return "unix://" + macSocket;
        }
        return "unix:///var/run/docker.sock";
    }

    private static String loadExampleStudyScript() throws IOException {
        Path cwd = Path.of("").toAbsolutePath();
        List<Path> candidates = List.of(
                cwd.resolve("ExampleStudy/extras/codeToRun.R"),
                cwd.resolve("../ExampleStudy/extras/codeToRun.R"));
        for (Path candidate : candidates) {
            if (Files.isRegularFile(candidate)) {
                return Files.readString(candidate);
            }
        }
        throw new IOException("Could not find ExampleStudy/extras/codeToRun.R from " + cwd);
    }
}

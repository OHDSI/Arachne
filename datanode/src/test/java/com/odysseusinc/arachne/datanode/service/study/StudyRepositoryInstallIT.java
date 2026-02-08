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

import com.odysseusinc.arachne.datanode.config.DockerConfig;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Integration test: pulls the example study image (darwin-eu-dev/examplestudy) from the registry,
 * same as when the user clicks Install in the UI. Run with make install-test (sources datanode.env).
 */
@SpringBootTest(classes = {DockerConfig.class, StudyRepositoryConnectionService.class})
@TestPropertySource(properties = {
    "docker.registry.host=hub.docker.com",
    "docker.registry.username=",
    "docker.registry.password="
})
class StudyRepositoryInstallIT {

    private static final Logger LOG = LoggerFactory.getLogger(StudyRepositoryInstallIT.class);
    private static final String ENV_REGISTRY_URL = "ARACHNE_DOCKER_REGISTRY_URL";
    private static final String ENV_REGISTRY_USER = "ARACHNE_DOCKER_REGISTRY_USER";
    private static final String ENV_REGISTRY_TOKEN = "ARACHNE_DOCKER_REGISTRY_TOKEN";

    /** Repo name and version used by the install test (must exist in the configured registry). */
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
            dockerHost = "unix:///var/run/docker.sock";
            System.setProperty("DOCKER_HOST", dockerHost);
        }
        System.setProperty("arachne.docker.host", dockerHost);
    }

    @Autowired
    private StudyRepositoryConnectionService service;

    /**
     * Pulls darwin-eu-dev/examplestudy from the registry (same as UI Install). Requires
     * ARACHNE_DOCKER_REGISTRY_* in environment (e.g. from make install-test / datanode.env).
     * Allow up to 5 minutes for the Docker pull.
     */
    @Test
    @Timeout(value = 5, unit = TimeUnit.MINUTES)
    void pullStudyImage_darwinEuDevExampleStudy() {
        String url = System.getenv(ENV_REGISTRY_URL);
        String user = System.getenv(ENV_REGISTRY_USER);
        String token = System.getenv(ENV_REGISTRY_TOKEN);

        Assumptions.assumeTrue(url != null && !url.isBlank(), ENV_REGISTRY_URL + " must be set");
        Assumptions.assumeTrue(user != null && !user.isBlank(), ENV_REGISTRY_USER + " must be set");
        Assumptions.assumeTrue(token != null && !token.isBlank(), ENV_REGISTRY_TOKEN + " must be set");

        LOG.info("Pulling study image {}:{} from registry", INSTALL_REPO, INSTALL_VERSION);
        try {
            service.pullStudyImage(INSTALL_REPO, INSTALL_VERSION, url.trim(), token, user.trim());
        } catch (RuntimeException e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            Throwable cause = e.getCause();
            String causeMsg = cause != null && cause.getMessage() != null ? cause.getMessage() : "";
            boolean notFound = msg.contains("404") || msg.contains("not found") || causeMsg.contains("404") || causeMsg.contains("not found");
            boolean noSocket = msg.contains("No such file or directory") || msg.contains("LastErrorException")
                    || causeMsg.contains("No such file or directory") || causeMsg.contains("LastErrorException");
            if (noSocket) {
                String warning = "WARNING: Docker host is not available. Start Docker (e.g. Docker Desktop) or set DOCKER_HOST. Skipping install-test.";
                LOG.warn(warning);
                System.err.println();
                System.err.println("*** " + warning + " ***");
                System.err.println();
            }
            Assumptions.assumeTrue(!noSocket, "Docker socket not available (start Docker or set DOCKER_HOST): " + msg);
            Assumptions.assumeTrue(!notFound,
                    "Image " + INSTALL_REPO + ":" + INSTALL_VERSION + " not in registry (push it or ignore): " + msg);
            throw e;
        }
        LOG.info("Pulled study image {}:{} successfully", INSTALL_REPO, INSTALL_VERSION);
    }
}

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

import com.odysseusinc.arachne.datanode.config.DockerConfig;
import com.odysseusinc.arachne.datanode.dto.study.ConnectionCheckResultDTO;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Integration test: runs the same check as the UI "Check connection" button — real Docker
 * daemon and real registry login. Use make env-test (which sets ARACHNE_DOCKER_REGISTRY_* from
 * datanode.env) so this test and the UI both succeed or both fail under the same conditions.
 */
@SpringBootTest(classes = {DockerConfig.class, StudyRepositoryConnectionService.class})
@TestPropertySource(properties = {
    "arachne.docker.host=unix:///var/run/docker.sock",
    "docker.registry.host=hub.docker.com",
    "docker.registry.username=",
    "docker.registry.password="
})
class StudyRepositoryConnectionServiceIT {

    private static final String ENV_REGISTRY_URL = "ARACHNE_DOCKER_REGISTRY_URL";
    private static final String ENV_REGISTRY_USER = "ARACHNE_DOCKER_REGISTRY_USER";
    private static final String ENV_REGISTRY_TOKEN = "ARACHNE_DOCKER_REGISTRY_TOKEN";

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
        // Force Unix socket so test matches UI (docker-java may read DOCKER_HOST from env at runtime)
        String dockerHost = System.getenv("DOCKER_HOST");
        if (dockerHost == null || dockerHost.isBlank() || dockerHost.contains("2375")) {
            System.setProperty("DOCKER_HOST", "unix:///var/run/docker.sock");
        }
    }

    @Autowired
    private StudyRepositoryConnectionService service;

    /**
     * Same logic as the UI "Check connection" button: real Docker client, real registry login.
     * Requires ARACHNE_DOCKER_REGISTRY_URL, ARACHNE_DOCKER_REGISTRY_USER, ARACHNE_DOCKER_REGISTRY_TOKEN
     * (e.g. from make env-test which sources datanode.env). Fails if Docker is down or login fails.
     */
    @Test
    void checkConnection_realDocker_sameAsUI() {
        String url = System.getenv(ENV_REGISTRY_URL);
        String user = System.getenv(ENV_REGISTRY_USER);
        String token = System.getenv(ENV_REGISTRY_TOKEN);

        Assumptions.assumeTrue(url != null && !url.isBlank(), ENV_REGISTRY_URL + " must be set");
        Assumptions.assumeTrue(user != null && !user.isBlank(), ENV_REGISTRY_USER + " must be set");
        Assumptions.assumeTrue(token != null && !token.isBlank(), ENV_REGISTRY_TOKEN + " must be set");

        ConnectionCheckResultDTO result = service.checkConnection(url.trim(), token, user.trim());

        assertThat(result.isSuccess())
            .as("Check connection must succeed (same result as UI button). Message: %s", result.getMessage())
            .isTrue();
        assertThat(result.getMessage()).isEqualTo("Connected to study registry.");
    }
}

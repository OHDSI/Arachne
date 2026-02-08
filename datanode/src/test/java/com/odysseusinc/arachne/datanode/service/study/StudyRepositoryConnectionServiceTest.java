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
import com.github.dockerjava.api.command.AuthCmd;
import com.github.dockerjava.api.model.AuthConfig;
import com.odysseusinc.arachne.datanode.dto.study.ConnectionCheckResultDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;

/**
 * Unit tests for {@link StudyRepositoryConnectionService#checkConnection} (validation and mock-based behavior).
 * For the real check (same as UI "Check connection" button), see {@link StudyRepositoryConnectionServiceIT} and use make env-test.
 */
@ExtendWith(MockitoExtension.class)
class StudyRepositoryConnectionServiceTest {

    @Mock
    private DockerClient dockerClient;

    @Mock
    private AuthCmd authCmd;

    private StudyRepositoryConnectionService service;

    @BeforeEach
    void setUp() {
        service = new StudyRepositoryConnectionService(dockerClient);
        lenient().when(dockerClient.authCmd()).thenReturn(authCmd);
        lenient().when(authCmd.withAuthConfig(any(AuthConfig.class))).thenReturn(authCmd);
    }

    @Test
    void checkConnection_fails_when_catalog_address_blank() {
        ConnectionCheckResultDTO result = service.checkConnection("", "token", "user");
        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).contains("Catalog address is required");
    }

    @Test
    void checkConnection_fails_when_token_blank() {
        ConnectionCheckResultDTO result = service.checkConnection("https://registry.example.com", "", "user");
        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).contains("Catalog token is required");
    }

    @Test
    void checkConnection_fails_when_username_blank() {
        ConnectionCheckResultDTO result = service.checkConnection("https://registry.example.com", "token", "");
        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).contains("Catalog username is required");
    }

    @Test
    void checkConnection_succeeds_and_calls_docker_login_with_given_credentials() {
        String registryUrl = "https://myregistry.azurecr.io";
        String user = "admin";
        String token = "secret-token";

        ConnectionCheckResultDTO result = service.checkConnection(registryUrl, token, user);

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.getMessage()).isEqualTo("Connected to study registry.");

        ArgumentCaptor<AuthConfig> authCaptor = ArgumentCaptor.forClass(AuthConfig.class);
        verify(authCmd).withAuthConfig(authCaptor.capture());
        verify(authCmd).exec();

        AuthConfig auth = authCaptor.getValue();
        assertThat(auth.getRegistryAddress()).isEqualTo(registryUrl);
        assertThat(auth.getUsername()).isEqualTo(user);
        assertThat(auth.getPassword()).isEqualTo(token);
    }
}

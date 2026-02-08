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

package com.odysseusinc.arachne.dockerrunner.config;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.AuthConfig;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

@Configuration
public class DockerClientConfig {

    @Value("${docker.host:unix:///var/run/docker.sock}")
    private String dockerHost;

    @Value("${docker.registry.url:}")
    private String registryUrl;
    @Value("${docker.registry.username:}")
    private String registryUsername;
    @Value("${docker.registry.password:}")
    private String registryPassword;

    @Bean
    public DockerClient dockerClient() {
        DefaultDockerClientConfig.Builder builder = DefaultDockerClientConfig.createDefaultConfigBuilder();
        if (dockerHost != null && !dockerHost.isBlank()) {
            builder.withDockerHost(dockerHost);
        }
        DefaultDockerClientConfig config = builder.build();
        URI host = config.getDockerHost();
        DockerHttpClient httpClient = new ApacheDockerHttpClient.Builder()
                .dockerHost(host)
                .sslConfig(config.getSSLConfig())
                .maxConnections(50)
                .build();
        return DockerClientImpl.getInstance(config, httpClient);
    }

    /**
     * Registry auth used when pulling images. Populated from ARACHNE_DOCKER_REGISTRY_* env vars when set.
     * If not set, pulls use no auth (public images or host-level docker login).
     */
    @Bean
    public AuthConfig registryAuthConfig() {
        if (registryUrl == null || registryUrl.isBlank() || registryPassword == null || registryPassword.isBlank()) {
            return null;
        }
        String url = registryUrl.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        return new AuthConfig()
                .withRegistryAddress(url)
                .withUsername(registryUsername != null && !registryUsername.isBlank() ? registryUsername.trim() : "")
                .withPassword(registryPassword);
    }
}

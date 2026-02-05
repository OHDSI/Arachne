/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.config;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import com.odysseusinc.arachne.datanode.config.properties.DockerProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

@Configuration
@EnableConfigurationProperties(DockerProperties.class)
public class DockerConfig {

    @Bean
    public DockerClientConfig dockerClientConfig(DockerProperties properties) {
        return DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost(properties.getHost())
                .withDockerTlsVerify(properties.isTlsVerify())
                .withDockerCertPath(properties.getCertPath())
                .withRegistryUrl(properties.getRegistry().getHost())
                .withRegistryUsername(properties.getRegistry().getUsername())
                .withRegistryPassword(properties.getRegistry().getPassword())
                .build();
    }

    /** Docker client for registry connection tests and listing containers/images. */
    @Bean
    public DockerClient dockerClient(DockerClientConfig dockerClientConfig) {
        DefaultDockerClientConfig config = (DefaultDockerClientConfig) dockerClientConfig;
        URI host = config.getDockerHost();
        DockerHttpClient httpClient = new ApacheDockerHttpClient.Builder()
                .dockerHost(host)
                .sslConfig(config.getSSLConfig())
                .maxConnections(50)
                .build();
        return DockerClientImpl.getInstance(config, httpClient);
    }
}

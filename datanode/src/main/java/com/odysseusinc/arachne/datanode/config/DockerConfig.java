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
package com.odysseusinc.arachne.datanode.config;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.AuthConfig;
import com.github.dockerjava.api.model.AuthConfigurations;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.core.RemoteApiVersion;
import com.github.dockerjava.core.SSLConfig;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.okhttp.OkDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import com.odysseusinc.arachne.datanode.config.properties.DockerProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

@Configuration
@EnableConfigurationProperties(DockerProperties.class)
public class DockerConfig {

    private static final Logger LOG = LoggerFactory.getLogger(DockerConfig.class);
    private static final String DEFAULT_UNIX_SOCKET = "unix:///var/run/docker.sock";

    /** Override for Docker host when set (e.g. in application.yml). Takes precedence over docker.host / DOCKER_HOST. */
    @Value("${arachne.docker.host:}")
    private String dockerHostOverride;

    /** Resolve Docker host, forcing Unix socket when env/config has localhost:2375 (avoids connection refused on macOS). */
    private String effectiveDockerHost(DockerProperties properties) {
        String raw = (dockerHostOverride != null && !dockerHostOverride.isBlank())
                ? dockerHostOverride
                : properties.getHost();
        if (raw == null || raw.isBlank()) {
            return DEFAULT_UNIX_SOCKET;
        }
        String normalized = raw.trim();
        if (normalized.contains("2375") || normalized.contains("localhost:2375")) {
            return DEFAULT_UNIX_SOCKET;
        }
        return normalized;
    }

    @Bean
    public DockerClientConfig dockerClientConfig(DockerProperties properties) {
        String host = effectiveDockerHost(properties);
        return DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost(host)
                .withDockerTlsVerify(properties.isTlsVerify())
                .withDockerCertPath(properties.getCertPath())
                .withRegistryUrl(properties.getRegistry().getHost())
                .withRegistryUsername(properties.getRegistry().getUsername())
                .withRegistryPassword(properties.getRegistry().getPassword())
                .build();
    }

    /** Wraps config so getDockerHost() always returns our effective URI (docker-java may read host from config at request time). */
    private DockerClientConfig configWithEffectiveHost(DockerClientConfig delegate, URI effectiveHostUri) {
        return new DockerClientConfig() {
            @Override
            public URI getDockerHost() {
                return effectiveHostUri;
            }
            @Override
            public RemoteApiVersion getApiVersion() { return delegate.getApiVersion(); }
            @Override
            public String getRegistryUsername() { return delegate.getRegistryUsername(); }
            @Override
            public String getRegistryPassword() { return delegate.getRegistryPassword(); }
            @Override
            public String getRegistryEmail() { return delegate.getRegistryEmail(); }
            @Override
            public String getRegistryUrl() { return delegate.getRegistryUrl(); }
            @Override
            public AuthConfig effectiveAuthConfig(String serverAddress) { return delegate.effectiveAuthConfig(serverAddress); }
            @Override
            public AuthConfigurations getAuthConfigurations() { return delegate.getAuthConfigurations(); }
            @Override
            @SuppressWarnings("deprecation")
            public SSLConfig getSSLConfig() { return delegate.getSSLConfig(); }
        };
    }

    /** Docker client for registry connection tests and listing containers/images. */
    @Bean
    public DockerClient dockerClient(DockerClientConfig dockerClientConfig, DockerProperties properties) {
        String hostStr = effectiveDockerHost(properties);
        URI hostUri = URI.create(hostStr);
        LOG.info("Docker client using host: {} (docker.host={}, arachne.docker.host={})",
                hostStr, properties.getHost(), dockerHostOverride != null ? dockerHostOverride : "");
        DockerClientConfig config = configWithEffectiveHost(dockerClientConfig, hostUri);
        DockerHttpClient httpClient = buildHttpClient(hostUri, dockerClientConfig.getSSLConfig());
        return DockerClientImpl.getInstance(config, httpClient);
    }

    /** Use OkHttp for unix sockets (Apache client maps unix to localhost:2375 and fails with connection refused). */
    @SuppressWarnings("deprecation")
    private DockerHttpClient buildHttpClient(URI hostUri, SSLConfig sslConfig) {
        if ("unix".equalsIgnoreCase(hostUri.getScheme())) {
            return new OkDockerHttpClient.Builder()
                    .dockerHost(hostUri)
                    .sslConfig(sslConfig)
                    .connectTimeout(10 * 1000)
                    .readTimeout(60 * 1000)
                    .build();
        }
        return new ApacheDockerHttpClient.Builder()
                .dockerHost(hostUri)
                .sslConfig(sslConfig)
                .maxConnections(50)
                .build();
    }
}

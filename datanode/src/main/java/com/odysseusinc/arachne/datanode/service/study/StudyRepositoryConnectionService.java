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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.AuthConfig;
import com.github.dockerjava.api.command.PullImageResultCallback;
import com.odysseusinc.arachne.datanode.dto.study.ConnectionCheckResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

/**
 * Checks connectivity to a Docker registry by running Docker login only (using
 * ARACHNE_DOCKER_REGISTRY_* env vars when set, else form credentials). No catalog or repo listing.
 */
@Service
public class StudyRepositoryConnectionService {

    private static final Logger LOG = LoggerFactory.getLogger(StudyRepositoryConnectionService.class);

    private final DockerClient dockerClient;

    @Value("${datanode.studyRepository.defaultRegistryUrl:}")
    private String envRegistryUrl;
    @Value("${datanode.studyRepository.defaultRegistryUser:}")
    private String envRegistryUser;
    @Value("${datanode.studyRepository.defaultRegistryToken:}")
    private String envRegistryToken;

    public StudyRepositoryConnectionService(@Autowired(required = false) DockerClient dockerClient) {
        this.dockerClient = dockerClient;
    }
    private static final int CONNECT_TIMEOUT_SECONDS = 10;
    private static final int READ_TIMEOUT_SECONDS = 10;
    private static final int CATALOG_PAGE_SIZE = 100;
    private static final ObjectMapper JSON = new ObjectMapper();

    /**
     * Check connection by running Docker login only. If login succeeds, the check succeeds.
     * No catalog or repository listing; no repo count in the result.
     *
     * @param catalogAddress registry base URL (e.g. https://registry.example.com or registry.example.com)
     * @param catalogToken   auth token or password (required for login)
     * @param catalogUsername username for Docker registry login (e.g. ACR registry name)
     * @return result with success true and message "Connected to study registry." on success; no repositories
     */
    public ConnectionCheckResultDTO checkConnection(String catalogAddress, String catalogToken, String catalogUsername) {
        LOG.info("Check connection: catalogAddress={}, tokenPresent={}, usernamePresent={}",
                catalogAddress != null ? catalogAddress.trim() : null,
                catalogToken != null && !catalogToken.isBlank(),
                catalogUsername != null && !catalogUsername.isBlank());

        if (catalogAddress == null || catalogAddress.isBlank()) {
            return new ConnectionCheckResultDTO(false, "Catalog address is required", null, null, null);
        }
        if (catalogToken == null || catalogToken.isBlank()) {
            return new ConnectionCheckResultDTO(false, "Catalog token is required", null, null, null);
        }
        if (catalogUsername == null || catalogUsername.isBlank()) {
            return new ConnectionCheckResultDTO(false, "Catalog username is required", null, null, null);
        }

        String registryBase = normalizeRegistryBase(catalogAddress.trim());
        if (registryBase == null) {
            return new ConnectionCheckResultDTO(false, "Invalid catalog address: " + catalogAddress, null, null, null);
        }

        if (dockerClient == null) {
            return new ConnectionCheckResultDTO(false, "Docker is not available. Connection check requires Docker.", null, null, null);
        }

        String dockerRegistryBase = registryBase;
        String dockerUser = catalogUsername.trim();
        String dockerToken = catalogToken;
        boolean useEnvCreds = envRegistryUrl != null && !envRegistryUrl.isBlank()
                && envRegistryToken != null && !envRegistryToken.isBlank();
        if (useEnvCreds) {
            String envBase = normalizeRegistryBase(envRegistryUrl.trim());
            if (envBase != null && envBase.equals(registryBase)) {
                dockerRegistryBase = envBase;
                dockerUser = (envRegistryUser != null && !envRegistryUser.isBlank())
                        ? envRegistryUser.trim() : deriveUsernameFromRegistry(envBase);
                dockerToken = envRegistryToken;
                LOG.info("Check connection: Docker login using ARACHNE_DOCKER_REGISTRY_* to {}", dockerRegistryBase);
            }
        }

        try {
            AuthConfig authConfig = buildAuthConfig(dockerRegistryBase, dockerToken, dockerUser);
            dockerClient.authCmd().withAuthConfig(authConfig).exec();
            LOG.info("Check connection: Docker login succeeded for {}", dockerRegistryBase);
            return new ConnectionCheckResultDTO(true, "Connected to study registry.", null, null, null);
        } catch (Exception e) {
            String message = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            LOG.warn("Check connection failed: Docker login to {} failed: {}", dockerRegistryBase, message);
            return new ConnectionCheckResultDTO(false, "Docker login failed: " + message, null, null, null);
        }
    }

    /**
     * Pull a study image from the registry so it is available locally. Used when the user installs a study
     * (repo name e.g. darwin-eu-dev/examplestudy). Installed studies are Docker images on the user's machine.
     *
     * @param repoName        repository name (e.g. darwin-eu-dev/examplestudy), as entered by the user
     * @param version        tag/version (e.g. 1.0.0 or latest)
     * @param catalogAddress registry base URL (e.g. https://executionengine.azurecr.io)
     * @param catalogToken   registry token or password
     * @param catalogUsername registry username (e.g. ACR admin)
     * @throws IllegalStateException if Docker is not available
     * @throws RuntimeException      if pull fails (e.g. image not found, auth failed)
     */
    public void pullStudyImage(String repoName, String version, String catalogAddress,
                               String catalogToken, String catalogUsername) {
        if (dockerClient == null) {
            throw new IllegalStateException("Docker is not available. Install requires Docker.");
        }
        String registryBase = normalizeRegistryBase(catalogAddress != null ? catalogAddress.trim() : "");
        if (registryBase == null) {
            throw new IllegalArgumentException("Invalid catalog address: " + catalogAddress);
        }
        String registryHost = registryHostFrom(registryBase);
        if (registryHost == null) {
            throw new IllegalArgumentException("Could not determine registry host from: " + catalogAddress);
        }
        String imageName = registryHost + "/" + repoName.trim() + ":" + (version != null && !version.isBlank() ? version.trim() : "latest");
        String dockerUser = catalogUsername != null && !catalogUsername.isBlank() ? catalogUsername.trim() : deriveUsernameFromRegistry(registryBase);
        String dockerToken = catalogToken;
        if (envRegistryUrl != null && !envRegistryUrl.isBlank() && envRegistryToken != null && !envRegistryToken.isBlank()) {
            String envBase = normalizeRegistryBase(envRegistryUrl.trim());
            if (envBase != null && envBase.equals(registryBase)) {
                dockerUser = (envRegistryUser != null && !envRegistryUser.isBlank()) ? envRegistryUser.trim() : deriveUsernameFromRegistry(envBase);
                dockerToken = envRegistryToken;
            }
        }
        LOG.info("Pulling study image: {}", imageName);
        try {
            var pullCmd = dockerClient.pullImageCmd(imageName);
            if (dockerToken != null && !dockerToken.isBlank()) {
                pullCmd = pullCmd.withAuthConfig(buildAuthConfig(registryBase, dockerToken, dockerUser));
            }
            pullCmd.exec(new PullImageResultCallback()).awaitCompletion();
            LOG.info("Pulled study image: {}", imageName);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Pull interrupted", e);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            LOG.warn("Pull failed for {}: {}", imageName, msg);
            throw new RuntimeException("Docker pull failed: " + msg, e);
        }
    }

    private static String registryHostFrom(String registryBase) {
        try {
            URI uri = URI.create(registryBase);
            String host = uri.getHost();
            if (host == null) host = uri.getAuthority();
            if (host == null || host.isEmpty()) return null;
            int port = uri.getPort();
            if (port > 0 && port != 80 && port != 443) {
                return host + ":" + port;
            }
            return host;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Build Basic auth for Registry V2 / ACR: when username is provided (e.g. ACR admin user),
     * use username:token; otherwise use oauth2:token for OAuth2/Docker identity tokens.
     */
    private static String buildRegistryBasicAuth(String registryBase, String catalogToken, String catalogUsername) {
        String user = (catalogUsername != null && !catalogUsername.isBlank())
                ? catalogUsername.trim()
                : "oauth2";
        String auth = user + ":" + catalogToken;
        String encoded = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        return "Basic " + encoded;
    }

    private AuthConfig buildAuthConfig(String registryBase, String catalogToken, String catalogUsername) {
        String username = catalogUsername != null && !catalogUsername.isBlank()
                ? catalogUsername.trim()
                : deriveUsernameFromRegistry(registryBase);
        return new AuthConfig()
                .withRegistryAddress(registryBase)
                .withUsername(username)
                .withPassword(catalogToken);
    }

    private static String deriveUsernameFromRegistry(String registryBase) {
        try {
            URI uri = URI.create(registryBase);
            String host = uri.getHost();
            if (host != null && !host.isEmpty()) {
                return host.split("\\.", 2)[0];
            }
        } catch (Exception ignored) {
        }
        return "oauth2";
    }

    /**
     * List repository names from the registry catalog.
     * When catalogUsername is present (e.g. ACR admin), uses Basic auth for both ACR and V2 APIs.
     * Otherwise tries Azure ACR with Bearer token first, then V2 catalog with Basic(oauth2:token).
     *
     * @param registryBase    base URL of the registry (e.g. https://myregistry.azurecr.io)
     * @param catalogToken    token or password (admin password for ACR when username present)
     * @param catalogUsername optional username (e.g. ACR admin username / registry name)
     * @param client          HTTP client to use
     * @return list of repository names, or empty list on failure or unsupported registry
     */
    public List<String> listRegistryRepositories(String registryBase, String catalogToken, String catalogUsername, HttpClient client) {
        if (registryBase == null || registryBase.isEmpty()) {
            return Collections.emptyList();
        }
        if (catalogToken == null || catalogToken.isBlank()) {
            List<String> v2Repos = fetchCatalogV2(registryBase, null, null, client);
            return v2Repos != null ? v2Repos : Collections.emptyList();
        }
        // When username present (e.g. ACR admin): use Basic auth for both ACR and V2
        boolean useBasic = catalogUsername != null && !catalogUsername.isBlank();
        if (useBasic) {
            String basicAuth = buildRegistryBasicAuth(registryBase, catalogToken, catalogUsername);
            List<String> repos = fetchCatalog(registryBase + "/acr/v1/_catalog?n=" + CATALOG_PAGE_SIZE, basicAuth, client);
            if (!repos.isEmpty()) {
                return repos;
            }
            List<String> v2Repos = fetchCatalogV2(registryBase, catalogToken, catalogUsername, client);
            return v2Repos != null ? v2Repos : Collections.emptyList();
        }
        // No username: try ACR with Bearer (ACR access token), then V2 with Basic(oauth2:token)
        List<String> repos = fetchCatalog(registryBase + "/acr/v1/_catalog?n=" + CATALOG_PAGE_SIZE,
                "Bearer " + catalogToken, client);
        if (!repos.isEmpty()) {
            return repos;
        }
        List<String> v2Repos = fetchCatalogV2(registryBase, catalogToken, catalogUsername, client);
        return v2Repos != null ? v2Repos : Collections.emptyList();
    }

    /**
     * Fetch catalog from a URL using Bearer or Basic auth and parse JSON {"repositories": ["a","b"]}.
     */
    private List<String> fetchCatalog(String catalogUrl, String authHeaderValue, HttpClient client) {
        try {
            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(catalogUrl))
                    .timeout(Duration.ofSeconds(READ_TIMEOUT_SECONDS))
                    .GET();
            if (authHeaderValue != null && !authHeaderValue.isBlank()) {
                builder.header("Authorization", authHeaderValue);
            }
            HttpResponse<String> response = client.send(builder.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() != 200) {
                return Collections.emptyList();
            }
            return parseRepositoriesFromCatalog(response.body());
        } catch (Exception e) {
            LOG.debug("Catalog fetch failed for {}: {}", catalogUrl, e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<String> fetchCatalogV2(String registryBase, String catalogToken, String catalogUsername, HttpClient client) {
        String v2CatalogUrl = registryBase + "/v2/_catalog?n=" + CATALOG_PAGE_SIZE;
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(v2CatalogUrl))
                .timeout(Duration.ofSeconds(READ_TIMEOUT_SECONDS))
                .GET();
        if (catalogToken != null && !catalogToken.isBlank()) {
            builder.header("Authorization", buildRegistryBasicAuth(registryBase, catalogToken, catalogUsername));
        }
        try {
            HttpResponse<String> response = client.send(builder.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() != 200) {
                return null;
            }
            return parseRepositoriesFromCatalog(response.body());
        } catch (Exception e) {
            LOG.debug("V2 catalog fetch failed for {}: {}", v2CatalogUrl, e.getMessage());
            return null;
        }
    }

    /**
     * List tags for a single repository (Docker image) using Azure ACR API.
     * Uses {@code GET /acr/v1/{repo}/_tags?n=limit} with Bearer token.
     * Intended for populating study versions for a given repo (e.g. myteam/myimage).
     *
     * @param catalogAddress registry base URL (e.g. https://myregistry.azurecr.io)
     * @param catalogToken   ACR access token (Bearer auth)
     * @param repo           repository name, e.g. "myteam/myimage"
     * @param limit          max number of tags to return (e.g. 100)
     * @return list of tag names, or empty list on failure or unsupported registry
     */
    public List<String> listRepositoryTags(String catalogAddress, String catalogToken, String repo, int limit) {
        if (repo == null || repo.isBlank()) {
            return Collections.emptyList();
        }
        String registryBase = normalizeRegistryBase(catalogAddress != null ? catalogAddress.trim() : "");
        if (registryBase == null) {
            return Collections.emptyList();
        }
        String tagsUrl = registryBase + "/acr/v1/" + repo + "/_tags?n=" + Math.max(1, Math.min(limit, 1000));
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(CONNECT_TIMEOUT_SECONDS))
                .build();
        try {
            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(tagsUrl))
                    .timeout(Duration.ofSeconds(READ_TIMEOUT_SECONDS))
                    .GET();
            if (catalogToken != null && !catalogToken.isBlank()) {
                builder.header("Authorization", "Bearer " + catalogToken.trim());
            }
            HttpResponse<String> response = client.send(builder.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() != 200) {
                LOG.debug("Tags fetch returned {} for {}", response.statusCode(), tagsUrl);
                return Collections.emptyList();
            }
            return parseTagNamesFromTagsResponse(response.body());
        } catch (Exception e) {
            LOG.debug("Tags fetch failed for {}: {}", tagsUrl, e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Parse ACR tags response: {"tags": [{"name": "1.0.0"}, ...]}.
     */
    private static List<String> parseTagNamesFromTagsResponse(String jsonBody) {
        if (jsonBody == null || jsonBody.isBlank()) {
            return Collections.emptyList();
        }
        try {
            JsonNode root = JSON.readTree(jsonBody);
            JsonNode tags = root != null ? root.get("tags") : null;
            if (tags == null || !tags.isArray()) {
                return Collections.emptyList();
            }
            List<String> list = new ArrayList<>(tags.size());
            for (JsonNode node : tags) {
                if (node != null && node.isObject()) {
                    JsonNode name = node.get("name");
                    if (name != null && name.isTextual()) {
                        list.add(name.asText());
                    }
                }
            }
            return list;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private static List<String> parseRepositoriesFromCatalog(String jsonBody) {
        if (jsonBody == null || jsonBody.isBlank()) {
            return Collections.emptyList();
        }
        try {
            JsonNode root = JSON.readTree(jsonBody);
            JsonNode repos = root != null ? root.get("repositories") : null;
            if (repos == null || !repos.isArray()) {
                return Collections.emptyList();
            }
            List<String> list = new ArrayList<>(repos.size());
            for (JsonNode node : repos) {
                if (node != null && node.isTextual()) {
                    list.add(node.asText());
                }
            }
            return list;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Normalize user input to a registry base URL (scheme + host, no path).
     * Examples:
     * - "registry.example.com" -> "https://registry.example.com"
     * - "https://registry.example.com/studies" -> "https://registry.example.com"
     * - "http://localhost:5000" -> "http://localhost:5000"
     */
    private static String normalizeRegistryBase(String input) {
        String s = input.trim();
        if (s.isEmpty()) {
            return null;
        }
        if (!s.contains("://")) {
            s = "https://" + s;
        }
        try {
            URI uri = URI.create(s);
            String scheme = uri.getScheme();
            String host = uri.getHost();
            if (host == null) {
                host = uri.getAuthority();
            }
            if (host == null || host.isEmpty()) {
                return null;
            }
            int port = uri.getPort();
            if (port > 0 && port != 80 && port != 443) {
                return scheme + "://" + host + ":" + port;
            }
            return scheme + "://" + host;
        } catch (Exception e) {
            return null;
        }
    }
}

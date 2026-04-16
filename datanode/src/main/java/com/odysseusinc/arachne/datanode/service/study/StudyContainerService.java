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
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.exception.NotFoundException;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.Frame;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.Image;
import com.github.dockerjava.api.model.Ports;
import com.github.dockerjava.core.command.ExecStartResultCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Starts and stops study Docker containers (working dir /code), reads codeToRun.R
 * from the container, and runs the R script inside the container.
 */
@Service
public class StudyContainerService {

    private static final Logger LOG = LoggerFactory.getLogger(StudyContainerService.class);

    /** Working directory in the study image (ExampleStudy Dockerfile: WORKDIR /code). */
    public static final String STUDY_WORKDIR = "/code";

    /** Path in container for persistent editable codeToRun.R (source of truth in DB, synced here). */
    public static final String WORKSPACE_CODE_PATH = "/workspace/codeToRun.R";

    /** Default locations in image to seed from: /defaults/codeToRun.R then /code/extras/codeToRun.R. */
    private static final String DEFAULTS_CODE_PATH = "/defaults/codeToRun.R";

    /** Default output folder name when not found in script (e.g. codeToRun.R: outputFolder <- here::here("output")). */
    private static final String DEFAULT_OUTPUT_FOLDER = "output";

    /** Match outputFolder <- here::here("...") or outputFolder = "..." or outputFolder <- '...' in codeToRun.R. */
    private static final Pattern OUTPUT_FOLDER_PATTERN = Pattern.compile(
            "outputFolder\\s*(?:<-|=)\\s*(?:here::here\\s*\\(\\s*[\"']([^\"']+)[\"']\\s*\\)|[\"']([^\"']+)[\"'])",
            Pattern.CASE_INSENSITIVE);
    /** codeToRun.R locations: extras first, then root. */
    private static final String CODE_TO_RUN_EXTRAS = "/code/extras/codeToRun.R";
    private static final String CODE_TO_RUN_ROOT = "/code/codeToRun.R";
    private static final String RUN_SCRIPT_PATH = "/tmp/codeToRun_run.R";

    /** Shiny app port inside the container (R runApp default). Host port = SHINY_PORT_BASE + packageId. */
    public static final int SHINY_PORT_CONTAINER = 3838;
    private static final int SHINY_PORT_BASE = 3838;
    private static final String SHINY_LOG_PATH = "/tmp/shiny.log";
    private static final String SHINY_PID_PATH = "/tmp/shiny.pid";
    /** R function to launch results viewer (ExampleStudy NAMESPACE: export(launchResultsExplorer); first arg = dataFolder). */
    private static final String SHINY_LAUNCH_EXPR = "ExampleStudy::launchResultsExplorer('%s', launch.browser=FALSE)";

    private final DockerClient dockerClient;

    public StudyContainerService(@Autowired(required = false) DockerClient dockerClient) {
        this.dockerClient = dockerClient;
    }

    /**
     * Build full image name from catalog address and package name/version.
     * Example: https://myreg.azurecr.io + darwin-eu-dev/examplestudy + main -> myreg.azurecr.io/darwin-eu-dev/examplestudy:main
     * If name already starts with registry host (e.g. from stored catalogAddress), the prefix is stripped to avoid double-prefix.
     */
    public static String imageNameFor(String catalogAddress, String name, String version) {
        String host = registryHostFrom(catalogAddress);
        if (host == null) {
            throw new IllegalArgumentException("Invalid catalog address: " + catalogAddress);
        }
        String repo = stripRegistryPrefix(name.trim(), host);
        String tag = sanitizeImageTag(version);
        return host + "/" + repo + ":" + tag;
    }

    /** Remove leading registryHost/ from name to avoid double-prefix. */
    private static String stripRegistryPrefix(String name, String registryHost) {
        if (registryHost != null && name.startsWith(registryHost + "/")) {
            return name.substring(registryHost.length() + 1);
        }
        return name;
    }

    /** Docker image tag must not contain ':'. Use first segment if version contains colon. */
    private static String sanitizeImageTag(String version) {
        String tag = (version != null && !version.isBlank()) ? version.trim() : "latest";
        int colon = tag.indexOf(':');
        return colon >= 0 ? tag.substring(0, colon) : tag;
    }

    private static String registryHostFrom(String catalogAddress) {
        String base = catalogAddress != null ? catalogAddress.trim() : "";
        if (base.isEmpty()) return null;
        try {
            URI uri = URI.create(base);
            String host = uri.getHost();
            if (host == null) host = uri.getAuthority();
            // Bare hostname (e.g. "executionengine.azurecr.io") parses as path; re-parse with scheme
            if (host == null && !base.contains("://")) {
                uri = URI.create("https://" + base);
                host = uri.getHost();
                if (host == null) host = uri.getAuthority();
            }
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
     * Start a container from the study image (no Shiny port binding). Prefer {@link #startContainer(String, long, List)} when package id is available.
     */
    public String startContainer(String imageName) {
        return startContainer(imageName, 0, null);
    }

    /**
     * Start a container from the study image with working directory /code (no env vars).
     */
    public String startContainer(String imageName, long packageId) {
        return startContainer(imageName, packageId, null);
    }

    /**
     * Start a container from the study image with working directory /code.
     * Container runs tail -f /dev/null to stay alive. Binds container port 3838 (Shiny) to host port
     * SHINY_PORT_BASE + packageId when packageId > 0.
     * Environment variables from {@code env} (format "NAME=VALUE") are injected so codeToRun.R can use Sys.getenv().
     *
     * @param imageName full image name (e.g. registry/repo:tag)
     * @param packageId study package id; when > 0, Shiny port 3838 is bound to host port SHINY_PORT_BASE + packageId
     * @param env       optional list of "NAME=VALUE" entries to set in the container (e.g. from study env vars settings)
     * @return container id
     */
    public String startContainer(String imageName, long packageId, List<String> env) {
        if (dockerClient == null) {
            throw new IllegalStateException("Docker is not available.");
        }
        LOG.info("Starting study Docker container for image: {}", imageName);
        String name = "study-" + UUID.randomUUID();
        var createCmd = dockerClient.createContainerCmd(imageName)
                .withWorkingDir(STUDY_WORKDIR)
                .withCmd("tail", "-f", "/dev/null")
                .withName(name);
        if (env != null && !env.isEmpty()) {
            createCmd.withEnv(env);
        }
        if (packageId > 0) {
            ExposedPort shinyPort = ExposedPort.tcp(SHINY_PORT_CONTAINER);
            int hostPort = getShinyHostPort(packageId);
            Ports portBindings = new Ports();
            portBindings.bind(shinyPort, Ports.Binding.bindPort(hostPort));
            createCmd.withExposedPorts(shinyPort)
                    .withHostConfig(HostConfig.newHostConfig().withPortBindings(portBindings));
        }
        CreateContainerResponse created = createCmd.exec();
        String containerId = created.getId();
        LOG.info("Study container created: id={}, name={}, image={}", containerId, name, imageName);
        dockerClient.startContainerCmd(containerId).exec();
        LOG.info("Study Docker container started: id={}, name={}, image={}", containerId, name, imageName);
        return containerId;
    }

    /** Host port for Shiny for a given package id (must match port binding used in startContainer). */
    public static int getShinyHostPort(long packageId) {
        long hostPort = SHINY_PORT_BASE + packageId;
        if (hostPort > 65535) {
            throw new IllegalArgumentException("No free fixed Shiny port available for package id " + packageId);
        }
        return (int) hostPort;
    }

    /**
     * Start the results viewer Shiny app in the container (e.g. ExampleStudy::launchResultsExplorer(dataFolder)).
     * Runs in background; use getShinyLogs to see R console output and stopShinyApp to stop.
     *
     * @param containerId       running study container
     * @param outputFolderPath  path inside container to the output folder (e.g. /code/output)
     */
    public void startShinyApp(String containerId, String outputFolderPath) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) return;
        String expr = String.format(SHINY_LAUNCH_EXPR, outputFolderPath.replace("'", "'\\''"));
        String cmd = "nohup R -e \"" + expr + "\" >> " + SHINY_LOG_PATH + " 2>&1 & echo $! > " + SHINY_PID_PATH;
        execInContainer(containerId, "sh", "-c", cmd);
        LOG.info("Started Shiny app in container {} with dataFolder={}", containerId, outputFolderPath);
    }

    /** Stop the Shiny app process in the container (if running). */
    public void stopShinyApp(String containerId) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) return;
        String cmd = "test -f " + SHINY_PID_PATH + " && kill $(cat " + SHINY_PID_PATH + ") 2>/dev/null; rm -f " + SHINY_PID_PATH;
        execInContainer(containerId, "sh", "-c", cmd);
        LOG.info("Stopped Shiny app in container {}", containerId);
    }

    /** True if the Shiny process is likely running (PID file exists and process exists). */
    public boolean isShinyRunning(String containerId) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) return false;
        String out = execInContainer(containerId, "sh", "-c", "test -f " + SHINY_PID_PATH + " && kill -0 $(cat " + SHINY_PID_PATH + ") 2>/dev/null && echo yes || echo no");
        return out != null && out.trim().contains("yes");
    }

    /** Read Shiny app R console output from the container (for debugging). */
    public String getShinyLogs(String containerId) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) return "";
        try {
            return execInContainer(containerId, "cat", SHINY_LOG_PATH);
        } catch (Exception e) {
            LOG.warn("Could not read Shiny logs from container {}: {}", containerId, e.getMessage());
            return "";
        }
    }

    /**
     * List full image names (repo:tag) present locally, as from "docker image list".
     * Used to detect which installed studies have their image available.
     */
    public Set<String> listLocalImageNames() {
        if (dockerClient == null) {
            return Collections.emptySet();
        }
        try {
            List<Image> images = dockerClient.listImagesCmd().exec();
            Set<String> names = new HashSet<>();
            for (Image img : images) {
                String[] tags = img.getRepoTags();
                if (tags != null) {
                    names.addAll(Arrays.asList(tags));
                }
            }
            return names;
        } catch (Exception e) {
            LOG.warn("Failed to list local Docker images: {}", e.getMessage());
            return Collections.emptySet();
        }
    }

    /**
     * Repository part of a full image name (e.g. "registry/repo:tag" -> "registry/repo").
     * If there is no colon, the whole string is treated as the repository.
     */
    public static String repositoryFrom(String fullImageName) {
        if (fullImageName == null || fullImageName.isBlank()) return "";
        String s = fullImageName.trim();
        int lastColon = s.lastIndexOf(':');
        if (lastColon <= 0) return s; // no tag or only ":tag" (invalid)
        return s.substring(0, lastColon);
    }

    /** True if the exact image (repo:tag) is present in the provided local image set. */
    public static boolean hasImageInSet(Set<String> localImageNames, String fullImageName) {
        if (fullImageName == null || fullImageName.isBlank() || localImageNames == null) return false;
        return localImageNames.contains(fullImageName.trim());
    }

    /** True if the exact image (repo:tag) is present locally. */
    public boolean hasImageLocally(String imageName) {
        if (imageName == null || imageName.isBlank() || dockerClient == null) {
            return false;
        }
        return hasImageInSet(listLocalImageNames(), imageName);
    }

    public boolean isDockerAvailable() {
        return dockerClient != null;
    }

    /**
     * Fail-fast validation for runtime startup: Docker client must exist and daemon must respond to ping.
     */
    public void requireDockerAvailable() {
        if (dockerClient == null) {
            throw new IllegalStateException("Docker is not available. This application requires Docker.");
        }
        try {
            dockerClient.pingCmd().exec();
        } catch (Exception e) {
            throw new IllegalStateException("Docker daemon is not reachable. Start Docker and retry.", e);
        }
    }

    /** Returns true if the container exists and is running. */
    public boolean isContainerRunning(String containerId) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) {
            return false;
        }
        try {
            var inspect = dockerClient.inspectContainerCmd(containerId).exec();
            return inspect.getState().getRunning() != null && inspect.getState().getRunning();
        } catch (NotFoundException e) {
            return false;
        }
    }

    /**
     * Stop and remove all study containers (named "study-*"). Used to recover from port conflicts.
     */
    public void stopAllStudyContainers() {
        if (dockerClient == null) return;
        try {
            dockerClient.listContainersCmd()
                    .withNameFilter(List.of("study-"))
                    .withShowAll(true)
                    .exec()
                    .forEach(c -> {
                        LOG.info("Stopping stale study container: {} ({})", c.getId(), c.getNames() != null ? String.join(",", c.getNames()) : "unnamed");
                        stopContainer(c.getId());
                    });
        } catch (Exception e) {
            LOG.warn("Error listing study containers: {}", e.getMessage());
        }
    }

    /**
     * Stop and remove the container. Idempotent if container already gone.
     */
    public void stopContainer(String containerId) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) {
            return;
        }
        LOG.info("Stopping study Docker container: id={}", containerId);
        try {
            dockerClient.stopContainerCmd(containerId).withTimeout(10).exec();
            LOG.info("Study Docker container stopped: id={}", containerId);
        } catch (NotFoundException e) {
            LOG.info("Study container already stopped or removed: id={}", containerId);
        } catch (Exception e) {
            LOG.warn("Error stopping study container {}: {}", containerId, e.getMessage());
        }
        try {
            dockerClient.removeContainerCmd(containerId).withForce(true).exec();
            LOG.info("Study Docker container removed: id={}", containerId);
        } catch (NotFoundException e) {
            LOG.info("Study container already removed: id={}", containerId);
        } catch (Exception e) {
            LOG.warn("Error removing study container {}: {}", containerId, e.getMessage());
        }
    }

    /**
     * Read codeToRun.R from the container: try extras/codeToRun.R first, then codeToRun.R at root of study folder.
     */
    public String getCodeToRunFromContainer(String containerId) {
        if (dockerClient == null) {
            throw new IllegalStateException("Docker is not available.");
        }
        String content = execInContainer(containerId, "cat", CODE_TO_RUN_EXTRAS);
        if (content != null && !content.isBlank() && !content.contains("No such file") && !content.contains("not found")) {
            return content;
        }
        content = execInContainer(containerId, "cat", CODE_TO_RUN_ROOT);
        if (content != null && !content.contains("No such file") && !content.contains("not found")) {
            return content;
        }
        throw new IllegalStateException("codeToRun.R not found at " + CODE_TO_RUN_EXTRAS + " or " + CODE_TO_RUN_ROOT);
    }

    /**
     * Run the given R script in the container: write script to /tmp/codeToRun_run.R, then Rscript it.
     * Returns combined stdout and stderr. Script content is base64-decoded in the container to handle newlines.
     */
    public String executeScriptInContainer(String containerId, String scriptContent) {
        if (dockerClient == null) {
            throw new IllegalStateException("Docker is not available.");
        }
        String encoded = Base64.getEncoder().encodeToString(scriptContent.getBytes(StandardCharsets.UTF_8));
        // Write script: echo <base64> | base64 -d > /tmp/codeToRun_run.R
        String writeCmd = "echo " + encoded + " | base64 -d > " + RUN_SCRIPT_PATH;
        execInContainer(containerId, "sh", "-c", writeCmd);
        return execInContainer(containerId, "Rscript", RUN_SCRIPT_PATH);
    }

    /**
     * Execute a command in the container and return combined stdout/stderr as a string.
     */
    public String execInContainer(String containerId, String... cmd) {
        if (dockerClient == null || containerId == null) {
            return "";
        }
        var execCreate = dockerClient.execCreateCmd(containerId)
                .withCmd(cmd)
                .withAttachStdout(true)
                .withAttachStderr(true)
                .exec();
        AtomicReference<String> out = new AtomicReference<>("");
        try {
            dockerClient.execStartCmd(execCreate.getId())
                    .exec(execStartResultCallback(out))
                    .awaitCompletion();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Exec interrupted", e);
        }
        return out.get() != null ? out.get() : "";
    }

    @SuppressWarnings("deprecation")
    private static ExecStartResultCallback execStartResultCallback(AtomicReference<String> out) {
        return new ExecStartResultCallback() {
            @Override
            public void onNext(Frame frame) {
                String payload = new String(frame.getPayload(), StandardCharsets.UTF_8);
                out.updateAndGet(s -> s + payload);
            }
        };
    }

    /**
     * Parse the output folder name from codeToRun.R script content.
     * Looks for patterns like: outputFolder <- here::here("output") or outputFolder = "output".
     *
     * @param scriptContent content of codeToRun.R
     * @return folder name (e.g. "output"), or {@link #DEFAULT_OUTPUT_FOLDER} if not found
     */
    public static String parseOutputFolderFromScript(String scriptContent) {
        if (scriptContent == null || scriptContent.isBlank()) {
            return DEFAULT_OUTPUT_FOLDER;
        }
        Matcher m = OUTPUT_FOLDER_PATTERN.matcher(scriptContent);
        if (m.find()) {
            String name = m.group(1);
            if (name != null && !name.isBlank()) return name.trim();
            name = m.group(2);
            if (name != null && !name.isBlank()) return name.trim();
        }
        return DEFAULT_OUTPUT_FOLDER;
    }

    /**
     * Clear the study output folder in the container so only this run's outputs are present when we copy.
     * Prevents files from a previous run (same container) from being saved to the new run.
     *
     * @param containerId      running container id
     * @param outputFolderName folder name (e.g. "output") as set in codeToRun.R
     */
    public void clearOutputFolderInContainer(String containerId, String outputFolderName) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) {
            return;
        }
        String pathInContainer = resolveOutputFolderPath(outputFolderName);
        String quotedPath = shellQuote(pathInContainer);
        String cmd = "mkdir -p " + quotedPath + "; find " + quotedPath
                + " -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +";
        try {
            execInContainer(containerId, "sh", "-c", cmd);
        } catch (Exception e) {
            LOG.warn("Could not clear output folder {} in container {}: {}", pathInContainer, containerId, e.getMessage());
        }
    }

    /**
     * Copy the study output folder from the container as a tar stream.
     * The path in the container is {@code STUDY_WORKDIR + "/" + outputFolderName} (e.g. /code/output).
     * Caller must close the returned stream.
     *
     * @param containerId      running container id
     * @param outputFolderName folder name (e.g. "output") as set in codeToRun.R
     * @return tar archive input stream, or null if Docker unavailable or path missing
     */
    public InputStream copyOutputFolderFromContainer(String containerId, String outputFolderName) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) {
            return null;
        }
        String pathInContainer = resolveOutputFolderPath(outputFolderName);
        try {
            return dockerClient.copyArchiveFromContainerCmd(containerId, pathInContainer).exec();
        } catch (NotFoundException e) {
            LOG.warn("Output folder not found in container {} at {}: {}", containerId, pathInContainer, e.getMessage());
            return null;
        }
    }

    /**
     * Read the default code file from an image without running it: create a temporary container,
     * start it, copy the file from the given path (or fallback paths), then remove the container.
     * Tries {@value #DEFAULTS_CODE_PATH} first, then {@value #CODE_TO_RUN_EXTRAS}.
     *
     * @param imageName full image name (e.g. registry/name:tag)
     * @return content of the default codeToRun.R, or empty string if not found
     */
    public String readDefaultCodeFromImage(String imageName) {
        if (dockerClient == null) {
            throw new IllegalStateException("Docker is not available.");
        }
        String tempName = "study-seed-" + UUID.randomUUID();
        CreateContainerResponse created = dockerClient.createContainerCmd(imageName)
                .withCmd("tail", "-f", "/dev/null")
                .withName(tempName)
                .exec();
        String containerId = created.getId();
        try {
            dockerClient.startContainerCmd(containerId).exec();
            for (String path : new String[]{DEFAULTS_CODE_PATH, CODE_TO_RUN_EXTRAS, CODE_TO_RUN_ROOT}) {
                try (InputStream tarStream = dockerClient.copyArchiveFromContainerCmd(containerId, path).exec()) {
                    List<Map.Entry<String, byte[]>> files = StudyRunResultExtractor.extractFilesFromTar(tarStream);
                    if (!files.isEmpty()) {
                        byte[] first = files.get(0).getValue();
                        return first != null ? new String(first, StandardCharsets.UTF_8) : "";
                    }
                } catch (NotFoundException e) {
                    LOG.debug("Default code not at {}: {}", path, e.getMessage());
                }
            }
            return "";
        } catch (IOException e) {
            throw new RuntimeException("Failed to read default code from image " + imageName, e);
        } finally {
            stopContainer(containerId);
        }
    }

    /**
     * List one level of directory contents inside the container. Path must be under {@value #STUDY_WORKDIR}.
     *
     * @param containerId running container id
     * @param path        absolute path inside container (e.g. /code or /code/output)
     * @return list of entries: name and "dir" or "file"; empty if path invalid or listing fails
     */
    public List<DirEntry> listDirectory(String containerId, String path) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) {
            return List.of();
        }
        String normalized = normalizePathUnderWorkdir(path);
        if (normalized == null) {
            return List.of();
        }
        // Portable: list one level, output "basename type" per line (d or f)
        String cmd = "for f in " + normalized + "/*; do [ -e \"$f\" ] && echo \"$(basename \"$f\") $(test -d \"$f\" && echo d || echo f)\"; done";
        String out = execInContainer(containerId, "sh", "-c", cmd);
        List<DirEntry> entries = new ArrayList<>();
        if (out == null) return entries;
        for (String line : out.split("\n")) {
            line = line.trim();
            if (line.isEmpty()) continue;
            int lastSpace = line.lastIndexOf(' ');
            if (lastSpace <= 0) continue;
            String name = line.substring(0, lastSpace).trim();
            String typeStr = line.substring(lastSpace + 1).trim();
            if (name.isEmpty()) continue;
            if (".".equals(name) || "..".equals(name)) continue;
            boolean isDir = "d".equalsIgnoreCase(typeStr);
            entries.add(new DirEntry(name, isDir ? DirEntry.Type.DIR : DirEntry.Type.FILE));
        }
        entries.sort((a, b) -> {
            if (a.getType() != b.getType()) return a.getType() == DirEntry.Type.DIR ? -1 : 1;
            return String.CASE_INSENSITIVE_ORDER.compare(a.getName(), b.getName());
        });
        return entries;
    }

    /**
     * Read a text-like file inside the running container for read-only preview.
     * Path must be under {@value #STUDY_WORKDIR}. Returns at most {@code maxBytes}.
     */
    public Optional<TextFilePreview> readTextFilePreview(String containerId, String path, int maxBytes) {
        if (dockerClient == null || containerId == null || containerId.isBlank()) {
            return Optional.empty();
        }
        String normalized = normalizePathUnderWorkdir(path);
        if (normalized == null) {
            return Optional.empty();
        }
        int limit = maxBytes > 0 ? maxBytes : 256 * 1024;
        String quotedPath = shellQuote(normalized);
        String sizeOut = execInContainer(containerId, "sh", "-c",
                "if [ -f " + quotedPath + " ]; then wc -c < " + quotedPath + "; else echo -1; fi");
        long size = parseLongOrDefault(sizeOut, -1L);
        if (size < 0) {
            return Optional.empty();
        }
        String content = execInContainer(containerId, "sh", "-c", "head -c " + limit + " " + quotedPath);
        return Optional.of(new TextFilePreview(normalized, content != null ? content : "", size, size > limit));
    }

    private static String shellQuote(String value) {
        return "'" + value.replace("'", "'\"'\"'") + "'";
    }

    private static long parseLongOrDefault(String raw, long defaultValue) {
        if (raw == null) return defaultValue;
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) return defaultValue;
        try {
            return Long.parseLong(trimmed);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private static String resolveOutputFolderPath(String outputFolderName) {
        String folder = outputFolderName != null && !outputFolderName.isBlank() ? outputFolderName : DEFAULT_OUTPUT_FOLDER;
        String normalized = normalizePathUnderWorkdir(STUDY_WORKDIR + "/" + folder);
        if (normalized == null) {
            throw new IllegalArgumentException("outputFolder must resolve under " + STUDY_WORKDIR + ": " + folder);
        }
        return normalized;
    }

    /** Path must be under STUDY_WORKDIR; returns normalized path (forward slashes) or null if invalid. */
    private static String normalizePathUnderWorkdir(String path) {
        if (path == null || path.isBlank()) return STUDY_WORKDIR;
        if (path.contains("..")) return null;
        String normalized = Paths.get(path).normalize().toString().replace('\\', '/');
        if (!normalized.startsWith("/")) normalized = "/" + normalized;
        if (!normalized.startsWith(STUDY_WORKDIR + "/") && !normalized.equals(STUDY_WORKDIR)) {
            return null;
        }
        return normalized;
    }

    /** One entry from listDirectory. */
    public static final class DirEntry {
        public enum Type { DIR, FILE }
        private final String name;
        private final Type type;

        public DirEntry(String name, Type type) {
            this.name = name;
            this.type = type;
        }

        public String getName() { return name; }
        public Type getType() { return type; }
    }

    /** Read-only text preview payload from a container file. */
    public static final class TextFilePreview {
        private final String path;
        private final String content;
        private final long size;
        private final boolean truncated;

        public TextFilePreview(String path, String content, long size, boolean truncated) {
            this.path = path;
            this.content = content;
            this.size = size;
            this.truncated = truncated;
        }

        public String getPath() { return path; }
        public String getContent() { return content; }
        public long getSize() { return size; }
        public boolean isTruncated() { return truncated; }
    }

    /**
     * Ensure /workspace exists in the container and write content to {@value #WORKSPACE_CODE_PATH}.
     * Does not mutate the image; only writes inside the container filesystem.
     * Uses base64 to avoid stdin piping (docker-java exec does not support stdin).
     *
     * @param containerId running container id
     * @param content     content to write to /workspace/codeToRun.R
     */
    public void syncCodeToRunningContainer(String containerId, String content) {
        if (dockerClient == null) {
            throw new IllegalStateException("Docker is not available.");
        }
        if (containerId == null || containerId.isBlank()) {
            throw new IllegalArgumentException("containerId is required");
        }
        String safeContent = content != null ? content : "";
        execInContainer(containerId, "sh", "-c", "mkdir -p /workspace");
        String encoded = Base64.getEncoder().encodeToString(safeContent.getBytes(StandardCharsets.UTF_8));
        execInContainer(containerId, "sh", "-c", "echo " + encoded + " | base64 -d > " + WORKSPACE_CODE_PATH);
    }
}

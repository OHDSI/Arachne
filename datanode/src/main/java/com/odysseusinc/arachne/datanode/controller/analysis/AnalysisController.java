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

package com.odysseusinc.arachne.datanode.controller.analysis;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import com.odysseusinc.arachne.commons.api.v1.dto.OptionDTO;
import com.odysseusinc.arachne.datanode.analysis.UploadDTO;
import com.odysseusinc.arachne.datanode.analysis.UploadService;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO;
import com.odysseusinc.arachne.datanode.exception.IllegalOperationException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFile;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.AnalysisResultsService;
import com.odysseusinc.arachne.datanode.service.AnalysisService;
import com.odysseusinc.arachne.datanode.service.UserService;
import com.odysseusinc.arachne.datanode.util.AddToZipFileVisitor;
import lombok.extern.slf4j.Slf4j;
import net.lingala.zip4j.ZipFile;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.text.MessageFormat;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipOutputStream;

@Slf4j
@RestController
@RequestMapping("/api/v1/analysis")
public class AnalysisController {

    @Autowired
    private UploadService uploadService;
    @Autowired
    private AnalysisService analysisService;
    @Autowired
    private AnalysisResultsService analysisResultsService;
    @Autowired
    private UserService userService;

    @PostMapping(path = "/upload/zip", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadDTO uploadZip(Principal principal, @RequestPart("file") List<MultipartFile> archive) {
        User user = userService.getUser(principal);
        return uploadService.uploadZip(user, archive);
    }

    @PostMapping(path = "/upload/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadDTO uploadFiles(Principal principal, @RequestPart("file") List<MultipartFile> files) {
        User user = userService.getUser(principal);
        return uploadService.uploadFiles(user, files);
    }

    @Async
    @PostMapping(path = "/execute/{id}")
    public CompletableFuture<?> execute(Principal principal, String id, @Valid @RequestBody AnalysisRequestDTO request) {
        User user = userService.getUser(principal);
        return analysisService.run(user, request, id);
    }

    @Async
    @PostMapping(path = "zip", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CompletableFuture<?> executeZip(
            @RequestPart("file") List<MultipartFile> archive,
            @RequestPart("analysis") @Valid AnalysisRequestDTO dto,
            Principal principal
    ) throws PermissionDeniedException {
        User user = userService.getUser(principal);
        UploadDTO upload = uploadService.uploadZip(user, archive);
        return analysisService.run(user, dto, upload.getName());
    }

    @Async
    @PostMapping(path = "files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CompletableFuture<Long> executeFiles(
            @RequestPart("file") List<MultipartFile> files,
            @RequestPart("analysis") @Valid AnalysisRequestDTO dto,
            Principal principal
    ) {
        User user = userService.getUser(principal);
        return analysisService.run(dto, user, files);
    }

    @GetMapping("{id}")
    public AnalysisRequestDTO get(@PathVariable("id") Long id) {
        return analysisService.get(id);
    }

    @GetMapping(value = "{id}/log", produces = MediaType.TEXT_PLAIN_VALUE)
    public String log(@PathVariable("id") Long id) {
        return analysisService.getStdout(id);
    }

    @Async
    @PostMapping("{id}/rerun")
    public CompletableFuture<?> rerun(@PathVariable("id") Long id, @Valid @RequestBody AnalysisRequestDTO analysisRequestDTO, Principal principal) {
        return analysisService.rerun(id, analysisRequestDTO, userService.getUser(principal));
    }

    @GetMapping(path = "{id}/results", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void downloadResults(@PathVariable("id") Long analysisId, HttpServletResponse response) throws IOException {

        Analysis analysis = analysisService.findAnalysis(analysisId)
                .orElseThrow(() -> new NotExistException(Analysis.class));
        List<AnalysisFile> resultFiles = analysisResultsService.getAnalysisResults(analysis);
        Path stdoutDir = Files.createTempDirectory("node_analysis");
        Path stdoutFile = stdoutDir.resolve("stdout.txt");
        try (Writer writer = new FileWriter(stdoutFile.toFile())) {
            IOUtils.write(analysis.getStdout(), writer);
        }
        String type = analysis.getType();
        String code = types().filter(t -> Objects.equals(t.name(), type)).findFirst().map(CommonAnalysisType::getCode).orElse(type);
        String filename = MessageFormat.format("{0}-a{1,number,#}-results", code, analysis.getId());

        if (AnalysisResultsService.isListOfArchive(resultFiles)) {
            AnalysisFile headFile = resultFiles.stream().filter(f -> f.getLink().matches(".*\\.zip")).findFirst().orElseThrow(() -> {
                log.error("Head file not found in multi-volume archive for results [{}]", analysisId);
                return new IllegalOperationException(MessageFormat.format("No head file of multi-volume archvie for results [{0}]", analysisId));
            });
            try (ZipFile zip = new ZipFile(headFile.getLink())) {
                zip.extractAll(stdoutDir.toString());
            }
        } else {
            for (AnalysisFile f : resultFiles) {
                Files.copy(Paths.get(f.getLink()), stdoutDir);
            }
        }

        response.setContentType(MimeTypeUtils.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + ".zip\"");
        try (ZipOutputStream zip = new ZipOutputStream(response.getOutputStream())) {
            Files.walkFileTree(stdoutDir, AddToZipFileVisitor.of(stdoutDir, zip));
        } finally {
            FileUtils.deleteQuietly(stdoutDir.toFile());
        }
    }

    @PostMapping("{id}/cancel")
    public void cancel(@PathVariable("id") Long analysisId, Principal principal) {
        analysisService.cancel(analysisId, userService.getUser(principal));
    }

    @GetMapping(path = "/types", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<OptionDTO> getTypes() {

        return types()
                .map(type -> new OptionDTO(type.name(), type.getTitle()))
                .collect(Collectors.toList());
    }

    private Stream<CommonAnalysisType> types() {
        return Stream.of(CommonAnalysisType.CUSTOM, CommonAnalysisType.STRATEGUS);
    }

}

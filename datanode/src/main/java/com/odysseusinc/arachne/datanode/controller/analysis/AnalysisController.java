/*
 *
 * Copyright 2019 Odysseus Data Services, inc.
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Vitaly Koulakov, Anastasiia Klochkova, Sergej Suvorov, Anton Stepanov
 * Created: Jul 8, 2019
 *
 */

package com.odysseusinc.arachne.datanode.controller.analysis;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import com.odysseusinc.arachne.commons.api.v1.dto.OptionDTO;
import com.odysseusinc.arachne.commons.utils.ZipUtils;
import com.odysseusinc.arachne.datanode.Constants;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO;
import com.odysseusinc.arachne.datanode.exception.BadRequestException;
import com.odysseusinc.arachne.datanode.exception.IllegalOperationException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFile;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.AnalysisResultsService;
import com.odysseusinc.arachne.datanode.service.UserService;
import com.odysseusinc.arachne.datanode.service.impl.AnalysisResultsServiceImpl;
import com.odysseusinc.arachne.datanode.service.impl.AnalysisServiceImpl;
import com.odysseusinc.arachne.execution_engine_common.util.CommonFileUtils;
import lombok.extern.slf4j.Slf4j;
import net.lingala.zip4j.ZipFile;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.text.MessageFormat;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@RestController
@RequestMapping("/api/v1/analysis")
public class AnalysisController {

    @Autowired
    private AnalysisServiceImpl analysisService;
    @Autowired
    private AnalysisResultsService analysisResultsService;
    @Autowired
    private UserService userService;

    @PostMapping(path = "zip", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> executeZip(
            @RequestPart("file") List<MultipartFile> archive,
            @RequestPart("analysis") @Valid AnalysisRequestDTO dto,
            Principal principal
    ) throws PermissionDeniedException {
        User user = userService.getUser(principal);
        MultipartFile zip = archive.stream().reduce((a, b) -> {
            throw new BadRequestException("Multiple files submitted. Only one zip archive is expected");
        }).orElseThrow(() ->
                new BadRequestException("No files submitted in request")
        );

        Consumer<File> writeFiles = dir -> {
            File zipDir = Paths.get(dir.getPath(), Constants.Analysis.SUBMISSION_ARCHIVE_SUBDIR).toFile();
            try {
                FileUtils.forceMkdir(zipDir);
                File archiveFile = new File(zipDir, "analysis.zip");
                zip.transferTo(archiveFile);
                CommonFileUtils.unzipFiles(archiveFile, dir);
            } catch (IOException e) {
                log.error("Failed to save analysis files", e);
                throw new IllegalOperationException(e.getMessage());
            } finally {
                FileUtils.deleteQuietly(zipDir);
            }

        };
        Long id = analysisService.run(dto, user, writeFiles);
        return ResponseEntity.ok(id);
    }

    @PostMapping(path = "files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> executeFiles(
            @RequestPart("file") List<MultipartFile> archive,
            @RequestPart("analysis") @Valid AnalysisRequestDTO dto,
            Principal principal
    ) throws PermissionDeniedException {
        User user = userService.getUser(principal);
        Consumer<File> files = dir ->
                archive.forEach(file -> {
                    try {
                        file.transferTo(new File(dir, file.getOriginalFilename()));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
        Long id = analysisService.run(dto, user, files);
        return ResponseEntity.ok(id);
    }

    @GetMapping("{id}")
    public AnalysisRequestDTO get(@PathVariable("id") Long id) {
        return analysisService.get(id);
    }

    @GetMapping(value = "{id}/log", produces = MediaType.TEXT_PLAIN_VALUE)
    public String log(@PathVariable("id") Long id) {
        return analysisService.getStdout(id);
    }

    @PostMapping("{id}/rerun")
    public void rerun(@PathVariable("id") Long id, @Valid AnalysisRequestDTO analysisRequestDTO, Principal principal) {
        analysisService.rerun(id, analysisRequestDTO, userService.getUser(principal));
    }

    @RequestMapping(
            method = RequestMethod.GET,
            path = "{id}/results",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    public void downloadResults(@PathVariable("id") Long analysisId, HttpServletResponse response) throws IOException {

        Analysis analysis = analysisService.findAnalysis(analysisId)
                .orElseThrow(() -> new NotExistException(Analysis.class));
        List<AnalysisFile> resultFiles = analysisResultsService.getAnalysisResults(analysis);
        Path stdoutDir = Files.createTempDirectory("node_analysis");
        Path stdoutFile = stdoutDir.resolve("stdout.txt");
        try(Writer writer = new FileWriter(stdoutFile.toFile())) {
            IOUtils.write(analysis.getStdout(), writer);
        }

        String filename = MessageFormat.format("{0}-a{1,number,#}-results", analysis.getType().getCode(), analysis.getId());
        final Path archive = Files.createTempFile(filename, ".zip");

        if (AnalysisResultsServiceImpl.isListOfArchive(resultFiles)) {
            AnalysisFile headFile = resultFiles.stream().filter(f -> f.getLink().matches(".*\\.zip")).findFirst().orElseThrow(() -> {
                log.error("Head file not found in multi-volume archive for results [{}]", analysisId);
                return new IllegalOperationException(MessageFormat.format("No head file of multi-volume archvie for results [{0}]", analysisId));
            });
            try(ZipFile zip = new ZipFile(headFile.getLink())) {
                zip.extractAll(stdoutDir.toString());
            }
        } else {
            for(AnalysisFile f : resultFiles) {
                Files.copy(Paths.get(f.getLink()), stdoutDir);
            }
        }

        ZipUtils.zipDirectory(archive, stdoutDir);

        // add stdout to archive
        File file = archive.toFile();
        response.setContentType(MimeTypeUtils.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + ".zip\"");
        try (InputStream in = Files.newInputStream(file.toPath())) {
            IOUtils.copy(in, response.getOutputStream());
        } finally {
            FileUtils.deleteQuietly(file);
            FileUtils.deleteQuietly(stdoutDir.toFile());
        }
    }

    @PostMapping("{id}/cancel")
    public void cancel(@PathVariable("id") Long analysisId, Principal principal) throws IOException {
        analysisService.cancel(analysisId, userService.getUser(principal));
    }

    @RequestMapping(
            method = RequestMethod.GET,
            path = "/types",
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public List<OptionDTO> getTypes() {

        return Stream.of(CommonAnalysisType.values())
                .map(type -> new OptionDTO(type.name(), type.getTitle()))
                .collect(Collectors.toList());
    }

}

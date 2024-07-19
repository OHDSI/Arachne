/*
 * Copyright 2020, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.service;

import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisFileDTO;
import com.odysseusinc.arachne.datanode.exception.IllegalOperationException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFile;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisFileType;
import com.odysseusinc.arachne.datanode.repository.AnalysisFileRepository;
import com.odysseusinc.arachne.datanode.repository.AnalysisRepository;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.extern.slf4j.Slf4j;
import net.lingala.zip4j.model.FileHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import static com.odysseusinc.arachne.datanode.Constants.Analysis.ERROR_REPORTR_FILENAME;
import static com.odysseusinc.arachne.datanode.Constants.Analysis.ERROR_REPORT_FILENAME;
import static org.apache.commons.lang3.StringUtils.endsWithIgnoreCase;

@Service
@Transactional
@Slf4j
public class AnalysisResultsService {

    @Autowired
    private AnalysisFileRepository analysisFileRepository;
    @Autowired
    private AnalysisRepository analysisRepository;
    @Autowired
    private AnalysisStateService stateService;

    public List<AnalysisFile> getAnalysisResults(Analysis analysis) {

        return analysisFileRepository.findAllByAnalysisIdAndType(
                analysis.getId(),
                AnalysisFileType.ANALYSYS_RESULT);
    }

    public List<AnalysisFileDTO> getAnalysisResults(Long analysisId) {
        return analysisFiles(analysisId, files -> {
            if (isListOfArchive(files)) {
                return listFilesInZip(getValidZipArchive(files)
                        .orElseThrow(() -> new IllegalOperationException(MessageFormat.format("ZIP archive is not found in analysis [{0}]", analysisId))));
            } else {
                return files.stream().map(mapAnalysisFile()).collect(Collectors.toList());
            }
        });
    }

    public Resource getAnalysisResultFile(Long analysisId, String filename) {
        return analysisFiles(analysisId, files -> {
            if (isListOfArchive(files)) {
                return extractFileFromZip(getValidZipArchive(files)
                                .orElseThrow(() -> new IllegalOperationException(MessageFormat.format("ZIP archive is not found in analysis [{0}]", analysisId))),
                        filename);
            } else {
                return files.stream()
                        .filter(f -> Objects.equals(f.getLink(), filename))
                        .findFirst()
                        .map(f -> new FileSystemResource(f.getLink()))
                        .orElseThrow(() -> new NotExistException(MessageFormat.format("File [{0}] does not exist on analysis [{1}]", analysisId, filename), Analysis.class));
            }
        });
    }

    private Optional<AnalysisFile> getValidZipArchive(List<AnalysisFile> files) {
        return files.stream().filter(f -> {
            try(net.lingala.zip4j.ZipFile zip = new net.lingala.zip4j.ZipFile(f.getLink())) {
                return zip.isValidZipFile();
            } catch (IOException e) {
                log.error("Failed to find archive", e);
                throw new IllegalOperationException(MessageFormat.format("Failed to find archive: {0}", e.getMessage()));
            }
        }).findFirst();
    }

    private <T> T analysisFiles(Long analysisId, Function<List<AnalysisFile>, T> transform) {
        Analysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new NotExistException(MessageFormat.format("Analysis [{0}] not found", analysisId), Analysis.class));
        return transform.apply(getAnalysisResults(analysis));
    }

    private Resource extractFileFromZip(AnalysisFile archive, String filename) {
        Path file = Paths.get(archive.getLink());
        try (net.lingala.zip4j.ZipFile zipFile = new net.lingala.zip4j.ZipFile(file.toFile())) {
            Path extracted = Files.createTempDirectory("result_file");
            zipFile.extractFile(filename, extracted.toString());
            return new FileSystemResource(extracted.resolve(filename));
        } catch (IOException e) {
            log.error("Failed to list archive [{}]", archive.getLink(), e);
            throw new IllegalOperationException(MessageFormat.format("Failed to list archive [{0}]: {1}", archive.getLink(), e.getMessage()));
        }
    }

    private List<AnalysisFileDTO> listFilesInZip(AnalysisFile archive) {
        Path file = Paths.get(archive.getLink());
        try (net.lingala.zip4j.ZipFile zipFile = new net.lingala.zip4j.ZipFile(file.toFile())) {
            return zipFile.getFileHeaders().stream().map(mapAnalysisFile(archive)).collect(Collectors.toList());
        } catch (IOException e) {
            log.error("Failed to list archive [{}]", archive.getLink(), e);
            throw new RuntimeException(e);
        }
    }

    private static Function<FileHeader, AnalysisFileDTO> mapAnalysisFile(AnalysisFile archive) {
        return fh -> {
            AnalysisFileDTO dto = new AnalysisFileDTO();
            String filename = fh.getFileName();
            dto.setPath(filename);
            dto.setStatus(archive.getStatus());
            try {
                dto.setContentType(Files.probeContentType(Paths.get(filename)));
            } catch (IOException e) {
                log.warn("Failed to probe content type for file [{}]", filename, e);
            }
            return dto;
        };
    }

    private static Function<AnalysisFile, AnalysisFileDTO> mapAnalysisFile() {
        return f -> {
            AnalysisFileDTO dto = new AnalysisFileDTO();
            dto.setPath(f.getLink());
            dto.setStatus(f.getStatus());
            return dto;
        };
    }

    public static boolean isListOfArchive(List<AnalysisFile> files) {
        return files.stream()
                .map(f -> new net.lingala.zip4j.ZipFile(f.getLink()))
                .allMatch(AnalysisResultsService::isValidZipOrSplit);
    }

    private static boolean isValidZipOrSplit(net.lingala.zip4j.ZipFile file) {
        File fileOnDisk = file.getFile();
        return fileOnDisk.exists() && fileOnDisk.getName().matches(".*\\.z.+");
    }

    public Analysis markExecuted(Long id, File resultDir, String stage, String error, String stdout) {
        return analysisRepository.findById(id).map(analysis -> {
            File[] files = resultDir.listFiles();
            List<AnalysisFile> resultFiles = Stream.of(files).map(file ->
                    new AnalysisFile(file.getAbsolutePath(), AnalysisFileType.ANALYSYS_RESULT, analysis)
            ).collect(Collectors.toList());
            analysisFileRepository.saveAll(resultFiles);

            analysis.setAnalysisFolder(resultDir.getAbsolutePath());
            analysis.setStage(stage);
            analysis.setError(Optional.ofNullable(error).orElseGet(() -> evaluateErrorStatus(stage, resultDir)));
            analysis.setStdout(stdout);
            analysisRepository.save(analysis);
            stateService.handleStateFromEE(analysis, stage, analysis.getError());
            return analysis;

        }).orElseGet(() -> {
            log.warn("Analysis '{}' does not exists", id);
            return null;
        });
    }

    private String evaluateErrorStatus(String stage, File resultDir) {
        if (Objects.equals(stage, Stage.COMPLETED)) {
            File[] zipFiles = resultDir.listFiles((dir, name) -> name.endsWith(".zip"));
            if (checkZipArchiveForErrorFile(zipFiles)) {
                log.warn("Unexpected errorReport file found. Changing analysis status to FAILED for {}", resultDir);
                return "Error report file [" + ERROR_REPORT_FILENAME + "] found in result";
            }
        }
        return null;
    }

    private boolean checkZipArchiveForErrorFile(File[] listFiles) {

        return Stream.of(listFiles)
                .map(this::scanZipForErrorFilenames)
                .reduce(Boolean::logicalOr)
                .orElse(false);
    }

    private boolean scanZipForErrorFilenames(File zipFile) {

        try (ZipFile archive = new ZipFile(zipFile)) {
            return archive.stream()
                    .map(ZipEntry::getName)
                    .anyMatch(name -> endsWithIgnoreCase(name, ERROR_REPORT_FILENAME) || endsWithIgnoreCase(name, ERROR_REPORTR_FILENAME));
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }
}

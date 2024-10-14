/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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

import com.odysseusinc.arachne.datanode.exception.ArachneSystemRuntimeException;
import com.odysseusinc.arachne.datanode.service.client.engine.ExecutionEngineClient;
import com.odysseusinc.arachne.datanode.util.ZipUtils;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import lombok.extern.slf4j.Slf4j;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.model.enums.CompressionLevel;
import net.lingala.zip4j.model.enums.CompressionMethod;
import okio.BufferedSink;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.function.IOConsumer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ExecutionEngineIntegrationService {
    @Autowired
    private ExecutionEngineClient engineClient;

    public AnalysisRequestStatusDTO sendAnalysis(AnalysisRequestDTO requestDTO, File analysisFolder) {
        final File analysisTempDir = getTempDirectory("arachne_datanode_analysis_");
        try {
            final File archive = new File(analysisTempDir.toString(), "request.zip");
            compressAndSplit(analysisFolder, archive);
            log.info("Request [{}] with files for [{}], sending now", requestDTO.getId(), analysisFolder.getName());
            return engineClient.sendAnalysisRequest(requestDTO, true, archive.getName(),
                    okhttp3.RequestBody.create(archive, okhttp3.MediaType.parse(MediaType.APPLICATION_OCTET_STREAM))
            );
        } catch (IOException zipException) {
            throw new ArachneSystemRuntimeException(zipException.getMessage());
        } finally {
            FileUtils.deleteQuietly(analysisTempDir);
        }
    }

    public AnalysisRequestStatusDTO sendBareSql(AnalysisRequestDTO requestDTO, String archiveName, String name, byte[] content) {
        byte[] zip = ZipUtils.zipFile(name, content);
        OctetStreamRequestBody body = new OctetStreamRequestBody(sink -> sink.write(zip));
        return engineClient.sendAnalysisRequest(requestDTO, true, archiveName, body);
    }

    public AnalysisRequestStatusDTO sendArchive(AnalysisRequestDTO requestDTO, String name, byte[] archive) {
        OctetStreamRequestBody body = new OctetStreamRequestBody(sink -> sink.write(archive));
        return engineClient.sendAnalysisRequest(requestDTO, true, name, body);
    }

    private File getTempDirectory(String prefix) {

        try {
            return Files.createTempDirectory(prefix).toFile();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public AnalysisResultDTO sendCancel(Long analysisId) {
        return engineClient.cancel(analysisId);
    }

    private static void compressAndSplit(File analysisFolder, File archive) throws ZipException {
        File zipDir = new File(archive.getParent());
        try {
            Files.createDirectories(zipDir.toPath());
            ZipFile zipFile = new ZipFile(archive);
            ZipParameters parameters = getParameters(analysisFolder);
            List<File> filesToAdd = Files.walk(analysisFolder.toPath()).filter(path ->
                    !Files.isDirectory(path)
            ).map(Path::toFile).collect(Collectors.toList());

            zipFile.addFiles(filesToAdd, parameters);
        } catch (ZipException zipException) {
            throw new ZipException(String.format("Zip exception [folder: %s, zipArchive: %s]: %s",
                    analysisFolder.getAbsolutePath(), archive.getAbsolutePath(), zipException.getMessage()), zipException);
        } catch (IOException ioException) {
            log.error(ioException.getMessage(), ioException);
            throw new RuntimeException(ioException.getMessage());
        }
    }

    private static ZipParameters getParameters(File analysisFolder) {
        ZipParameters parameters = new ZipParameters();
        parameters.setCompressionMethod(CompressionMethod.DEFLATE);
        // High compression level was set selected as possible fix for a bug:
        // http://www.lingala.net/zip4j/forum/index.php?topic=225.0
        parameters.setCompressionLevel(CompressionLevel.MAXIMUM);
        parameters.setIncludeRootFolder(false);
        parameters.setReadHiddenFiles(false);
        parameters.setDefaultFolderPath(analysisFolder.getAbsolutePath());
        return parameters;
    }

    public static class OctetStreamRequestBody extends okhttp3.RequestBody {
        private final IOConsumer<BufferedSink> consumer;

        public OctetStreamRequestBody(IOConsumer<BufferedSink> consumer) {
            this.consumer = consumer;
        }

        @Override
        public okhttp3.MediaType contentType() {
            return okhttp3.MediaType.parse(MediaType.APPLICATION_OCTET_STREAM);
        }

        @Override
        public long contentLength() {
            return -1L;
        }

        @Override
        public void writeTo(@NotNull BufferedSink sink) throws IOException {
            consumer.accept(sink);
        }

    }
}

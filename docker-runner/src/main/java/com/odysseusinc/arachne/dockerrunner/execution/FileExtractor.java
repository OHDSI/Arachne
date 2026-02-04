/*
 * Copyright 2024 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.dockerrunner.execution;

import lombok.extern.slf4j.Slf4j;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Slf4j
public final class FileExtractor {

    private FileExtractor() {
    }

    /**
     * Extract uploaded file(s) to a temp directory under parentDir.
     * If compressed is true, the file is treated as a zip and extracted; otherwise written as-is.
     */
    public static File extractFiles(List<MultipartFile> files, String parentDir, boolean compressed) throws IOException {
        Path parent = new File(parentDir).toPath();
        Path directory = Files.createTempDirectory(parent, "exec-");
        File temporaryDir = directory.toFile();
        if (compressed && files != null && !files.isEmpty()) {
            MultipartFile file = files.get(0);
            File zipTemp = File.createTempFile("upload", ".zip", temporaryDir);
            file.transferTo(zipTemp);
            try {
                new ZipFile(zipTemp).extractAll(temporaryDir.getAbsolutePath());
            } catch (ZipException e) {
                throw new IOException("Failed to extract zip", e);
            }
            if (!zipTemp.delete()) {
                zipTemp.deleteOnExit();
            }
        } else if (files != null) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                File dest = new File(temporaryDir, file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
                file.transferTo(dest);
            }
        }
        return temporaryDir;
    }
}

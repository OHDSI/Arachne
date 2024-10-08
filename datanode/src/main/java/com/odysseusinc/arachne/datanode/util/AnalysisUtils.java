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

package com.odysseusinc.arachne.datanode.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
public class AnalysisUtils {
    private static final int TEMP_DIR_ATTEMPTS = 10000;

    private AnalysisUtils() {

    }

    public static File storeMultipartFiles(String parentDir, MultipartFile[] files) throws IOException {

        File multipartFilesDir = createUniqueDir(parentDir);
        for (MultipartFile multipartFile : files) {
            String name = multipartFile.getOriginalFilename();
            Path path = Paths.get(multipartFilesDir.getAbsolutePath(), name);
            File file = path.toFile();
            InputStream inputStream = multipartFile.getInputStream();
            FileUtils.copyToFile(inputStream, file);
        }
        return multipartFilesDir;
    }

    public static File createUniqueDir(String parentDir) {

        String baseName = System.currentTimeMillis() + "-";
        for (int counter = 0; counter < TEMP_DIR_ATTEMPTS; counter++) {
            Path uniquePath = Paths.get(parentDir, baseName + counter);
            try {
                return Files.createDirectories(uniquePath).toFile();
            } catch (IOException ex) {
                log.trace(ex.getMessage(), ex);
            }
        }
        throw new IllegalStateException("Failed to create directory within "
                + TEMP_DIR_ATTEMPTS + " attempts (tried "
                + baseName + "0 to " + baseName + (TEMP_DIR_ATTEMPTS - 1) + ')');

    }
}

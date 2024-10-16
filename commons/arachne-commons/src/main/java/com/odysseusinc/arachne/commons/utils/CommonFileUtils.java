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

package com.odysseusinc.arachne.commons.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CommonFileUtils {

    private static final Logger log = LoggerFactory.getLogger(CommonFileUtils.class);

    private static final String VISITOR_ACCESS_ERROR = "Access error when access to file '{}'. Skipped";

    private CommonFileUtils() {
    }

    public static List<File> getFiles(File parentDir) {

        if (parentDir == null || !parentDir.exists() || !parentDir.isDirectory()) {
            throw new IllegalArgumentException();
        }
        List<File> files = new ArrayList<>();
        try {
            Files.walkFileTree(parentDir.toPath(), new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path path, BasicFileAttributes attrs) throws IOException {

                    files.add(path.toFile());
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {

                    log.error(VISITOR_ACCESS_ERROR, file.getFileName().toString());
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException ex) {
            log.error(ex.getMessage(), ex);
        }
        files.sort(Comparator.comparing(File::toPath));
        return files;
    }

}

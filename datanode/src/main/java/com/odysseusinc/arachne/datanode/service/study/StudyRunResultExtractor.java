/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
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

import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Extracts regular files from a tar archive (e.g. from Docker copyArchiveFromContainer).
 * Skips directories and entries with path containing "..". Paths are normalized to be relative to the archive root.
 */
public final class StudyRunResultExtractor {

    private StudyRunResultExtractor() {
    }

    /**
     * Read tar stream and return each regular file as (relative path, content).
     * Caller must close the input stream.
     */
    public static List<Map.Entry<String, byte[]>> extractFilesFromTar(InputStream tarStream) throws IOException {
        List<Map.Entry<String, byte[]>> result = new ArrayList<>();
        if (tarStream == null) {
            return result;
        }
        try (TarArchiveInputStream tar = new TarArchiveInputStream(tarStream)) {
            TarArchiveEntry entry;
            while ((entry = tar.getNextTarEntry()) != null) {
                if (entry.isDirectory()) {
                    continue;
                }
                String name = entry.getName();
                if (name == null || name.contains("..")) {
                    continue;
                }
                // Strip leading path segment if present (e.g. "output/log.txt" -> "log.txt" or keep "output/log.txt")
                String relativePath = name;
                int slash = name.indexOf('/');
                if (slash >= 0 && slash < name.length() - 1) {
                    relativePath = name.substring(slash + 1);
                }
                if (relativePath.isEmpty()) {
                    continue;
                }
                ByteArrayOutputStream buf = new ByteArrayOutputStream();
                byte[] block = new byte[8192];
                int n;
                while ((n = tar.read(block)) != -1) {
                    buf.write(block, 0, n);
                }
                result.add(Map.entry(relativePath, buf.toByteArray()));
            }
        }
        return result;
    }
}

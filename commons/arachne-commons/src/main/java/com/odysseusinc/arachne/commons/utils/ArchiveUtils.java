/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: August 01, 2017
 *
 */

package com.odysseusinc.arachne.commons.utils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.ArchiveException;
import org.apache.commons.compress.archivers.ArchiveInputStream;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.springframework.core.io.InputStreamSource;

public class ArchiveUtils {

    private static final List<Pattern> patterns = new ArrayList<>(2);

    private static final Pattern extensionPattern = Pattern.compile("^[\\w,\\s-]+(\\..*)$");

    static {
        patterns.add(Pattern.compile(".*/packrat/packrat.lock$"));
        patterns.add(Pattern.compile(".*/packrat/packrat.opts$"));
    }

    private static final Map<String, Function<InputStream, ArchiveInputStream>> archiveStreamMap =
            new HashMap<>();

    private static Function<InputStream, ArchiveInputStream> NULL_ARCHIVE_FUNC = (in) -> new NullArchiveInputStream();

    static {
        archiveStreamMap.put(".tar.gz", in -> {
            try {
                return new TarArchiveInputStream(new GzipCompressorInputStream(in));
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        });
        archiveStreamMap.put(".zip", ZipArchiveInputStream::new);
    }

    private static boolean isPackratBundle(InputStream inputStream, String originalFilename) throws IOException, ArchiveException {

        List<String> archiveContent = new LinkedList<>();
        ArchiveInputStream input = newArchiveInputStream(originalFilename, inputStream);
        ArchiveEntry archiveEntry;
        while ((archiveEntry = input.getNextEntry()) != null) {
            archiveContent.add(archiveEntry.getName());
        }
        return patterns.stream().allMatch(pattern ->
                archiveContent.stream().anyMatch(entry -> pattern.matcher(entry).matches()));
    }

    public static boolean isPackratBundle(InputStreamSource inputStreamSource, String originalFilename)
            throws IOException, ArchiveException {

        try (final InputStream in = new BufferedInputStream(inputStreamSource.getInputStream())) {
            return isPackratBundle(in, originalFilename);
        }
    }

    public static boolean isPackratBundle(File file, String originalFilename) throws IOException, ArchiveException {

        try (final InputStream in = new BufferedInputStream(new FileInputStream(file))) {
            return isPackratBundle(in, originalFilename);
        }
    }

    public static ArchiveInputStream newArchiveInputStream(String filename, InputStream in) {

        return detectArchive(filename).orElse(NULL_ARCHIVE_FUNC).apply(in);
    }

    private static Optional<Function<InputStream, ArchiveInputStream>> detectArchive(String filename) {

        Matcher matcher = extensionPattern.matcher(filename);
        if (matcher.matches()) {
            String ext = matcher.group(1);
            return Optional.ofNullable(archiveStreamMap.getOrDefault(ext, null));
        }
        return Optional.empty();
    }

    static class NullArchiveInputStream extends ArchiveInputStream {

        @Override
        public ArchiveEntry getNextEntry() throws IOException {

            return null;
        }
    }
}

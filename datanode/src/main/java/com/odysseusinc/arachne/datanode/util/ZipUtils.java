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
package com.odysseusinc.arachne.datanode.util;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.io.input.ProxyInputStream;
import org.apache.commons.lang3.function.FailableFunction;

import javax.validation.constraints.NotNull;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static java.nio.charset.StandardCharsets.UTF_8;
import static java.nio.file.FileVisitResult.CONTINUE;
import static java.nio.file.StandardOpenOption.CREATE;
import static java.nio.file.StandardOpenOption.WRITE;

public class ZipUtils {
    public static byte[] zipFile(String name, @NotNull byte[] content) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (ZipOutputStream zip = new ZipOutputStream(out)) {
            ZipEntry entry = new ZipEntry(name);
            entry.setSize(content.length);
            zip.putNextEntry(entry);
            zip.write(content);
            zip.closeEntry();
        } catch (IOException e) {
            throw new RuntimeException("Error packing file [" + name + "] of " + content.length + " bytes: " +  e);
        }
        return out.toByteArray();
    }

    public static void zip(Path archiveFile, Path path) throws IOException {
        try (
                OutputStream out = Files.newOutputStream(archiveFile, CREATE, WRITE);
                ZipOutputStream zip = new ZipOutputStream(out)
        ) {
            if (Files.isDirectory(path)) {
                Files.walkFileTree(path, new AddZipEntryFileVisitor(path, zip));
            } else {
                addZipEntry(zip, path, path.getFileName().toString());
            }
        }
    }

    @SafeVarargs
    public static Map<Function<String, FailableFunction<InputStream, Object, IOException>>, Map<String, Object>> processZip(
            InputStream source,
            Function<String, FailableFunction<InputStream, Object, IOException>>... converters
    ) {
        try (ZipArchiveInputStream zip = new ZipArchiveInputStream(source, UTF_8.name(), true, false, true)) {
            Map<Function<String, FailableFunction<InputStream, Object, IOException>>, Map<String, Object>> results = new HashMap<>();
            ArchiveEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                if (!entry.isDirectory()) {
                    String name = entry.getName();
                    for (Function<String, FailableFunction<InputStream, Object, IOException>> converter : converters) {
                        FailableFunction<InputStream, Object, IOException> found = converter.apply(name);
                        if (found != null) {
                            results.computeIfAbsent(converter, __ -> new HashMap<>()).put(name, found.apply(new NoCloseInputStream(zip)));
                            break;
                        }
                    }
                }
            }
            return results;
        } catch (IOException e) {
            throw new RuntimeException("Error processing zip", e);
        }
    }

    private static class NoCloseInputStream extends ProxyInputStream {
        public NoCloseInputStream(InputStream proxy) {
            super(proxy);
        }

        @Override
        public void close() throws IOException {
        }
    }

    private static void addZipEntry(ZipOutputStream zos, Path file, String realName) throws IOException {
        ZipEntry entry = new ZipEntry(realName);
        entry.setSize(file.toFile().length());
        zos.putNextEntry(entry);
        Files.copy(file, zos);
        zos.closeEntry();
    }

    private static class AddZipEntryFileVisitor extends SimpleFileVisitor<Path> {
        private final Path directory;
        private final ZipOutputStream zip;

        public AddZipEntryFileVisitor(Path directory, ZipOutputStream zip) {
            this.directory = directory;
            this.zip = zip;
        }

        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
            addZipEntry(zip, file, directory.relativize(file).toString());
            return CONTINUE;
        }
    }

}

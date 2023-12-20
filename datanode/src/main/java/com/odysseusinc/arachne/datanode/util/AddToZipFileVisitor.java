package com.odysseusinc.arachne.datanode.util;

import lombok.AllArgsConstructor;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static java.nio.file.FileVisitResult.CONTINUE;

@AllArgsConstructor(staticName = "of")
public class AddToZipFileVisitor extends SimpleFileVisitor<Path> {
    private final Path directory;
    private final ZipOutputStream zip;

    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
        String relName = directory.relativize(file).toString();
        ZipEntry entry = new ZipEntry(relName);
        entry.setSize(file.toFile().length());
        zip.putNextEntry(entry);
        zip.write(Files.readAllBytes(file));
        zip.closeEntry();
        return CONTINUE;
    }
}

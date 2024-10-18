package com.odysseusinc.arachne.datanode.analysis;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Slf4j
@Service
public class MetadataService {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Value("${datanode.metadata.filenames:}")
    private List<String> filenames;

    public JsonNode detect(List<Path> files) {
        return scan(files).map(this::parse).filter(Objects::nonNull).findFirst().orElse(null);
    }

    private Stream<Path> scan(List<Path> files) {
        return filenames.stream().flatMap(name ->
                files.stream().filter(file ->
                        name.equals(file.getFileName().toString())
                )
        );
    }

    private JsonNode parse(Path path) {
        try (FileInputStream is = new FileInputStream(path.toFile())) {
            return MAPPER.readTree(is);
        } catch (IOException e) {
            log.warn("Failed to parse metadata in [{}]: {}", path, e.getMessage());
            return null;
        }
    }

}

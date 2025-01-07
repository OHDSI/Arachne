package com.odysseusinc.arachne.datanode.analysis;

import com.fasterxml.jackson.databind.JsonNode;
import com.odysseusinc.arachne.TestContainersInitializer;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.impl.LegacyUserService;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @deprecated Rewrite this test using Cucumber.
 */
@SpringBootTest
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@ContextConfiguration(initializers = TestContainersInitializer.class)
public class UploadServiceTest {
    @Autowired
    private LegacyUserService userService;

    @Autowired
    private UploadService uploadService;

    @Test
    @Transactional
    public void metadata() throws IOException {
        User user = createUser();
        PathMatchingResourcePatternResolver pp = new PathMatchingResourcePatternResolver();
        Path parent = pp.getResources("classpath:/analysis/*")[0].getFile().toPath().getParent();
        Resource[] resources = pp.getResources("classpath:/analysis/**");
        List<MultipartFile> files = Stream.of(resources).map(resource ->
                toMultipartFile(resource, parent)
        ).filter(Objects::nonNull).collect(Collectors.toList());

        UploadDTO result = uploadService.uploadFiles(user, files);
        JsonNode metadata = result.getMetadata();
        Assertions.assertEquals("Simvastatin", metadata.get("analysisName").asText());
    }

    @SneakyThrows
    private MockMultipartFile toMultipartFile(Resource resource, Path parent) {
        File file = resource.getFile();
        String name = parent.relativize(file.toPath()).toString();
        return file.isFile() ? new MockMultipartFile(name, name, null, FileCopyUtils.copyToByteArray(resource.getInputStream())) : null;
    }

    private User createUser() {
        User user = new User();
        user.setUsername("first");
        user.setEmail("first@example.com");
        userService.create(user);
        return user;
    }

    private List<String> getResourceFiles(String path) throws IOException {
        List<String> filenames = new ArrayList<>();

        try (
                InputStream in = getResourceAsStream(path);
                BufferedReader br = new BufferedReader(new InputStreamReader(in))
        ) {
            String resource;

            while ((resource = br.readLine()) != null) {
                filenames.add(resource);
            }
        }

        return filenames;
    }

    private InputStream getResourceAsStream(String resource) {
        final InputStream in
                = getContextClassLoader().getResourceAsStream(resource);

        return in == null ? getClass().getResourceAsStream(resource) : in;
    }

    private ClassLoader getContextClassLoader() {
        return Thread.currentThread().getContextClassLoader();
    }
}

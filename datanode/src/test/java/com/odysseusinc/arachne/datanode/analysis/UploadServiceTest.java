package com.odysseusinc.arachne.datanode.analysis;

import com.fasterxml.jackson.databind.JsonNode;
import com.odysseusinc.arachne.TestContainersInitializer;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.user.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @deprecated Rewrite this test using Cucumber.
 */
@Deprecated
@SpringBootTest
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@ContextConfiguration(initializers = TestContainersInitializer.class)
public class UploadServiceTest {


    @Autowired
    private UserService userService;

    @Autowired
    private UploadService uploadService;

    @PersistenceContext
    private EntityManager em;


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

    private MockMultipartFile toMultipartFile(Resource resource, Path parent) {
        try {
            File file = resource.getFile();
            String name = parent.relativize(file.toPath()).toString();
            return file.isFile() ? new MockMultipartFile(name, name, null, FileCopyUtils.copyToByteArray(resource.getInputStream())) : null;
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private User createUser() {
        return userService.createEntity(user -> {
            user.setUsername("first");
            user.setEmail("first@example.com");
        });
    }
}

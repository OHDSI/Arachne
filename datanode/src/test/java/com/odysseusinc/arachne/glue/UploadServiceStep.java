package com.odysseusinc.arachne.glue;

import com.odysseusinc.arachne.datanode.analysis.UploadService;
import com.odysseusinc.arachne.datanode.model.user.User;
import io.cucumber.java.en.When;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UploadServiceStep {

    @Autowired
    private UploadService uploadService;

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private World world;

    @When("User {string} uploads the necessary files")
    public void upload(String name) throws IOException {
        User user = UserSteps.find(em, name);
        PathMatchingResourcePatternResolver pp = new PathMatchingResourcePatternResolver();
        Path parent = pp.getResources("classpath:/analysis/*")[0].getFile().toPath().getParent();
        Resource[] resources = pp.getResources("classpath:/analysis/**");
        List<MultipartFile> files = Stream.of(resources).map(resource -> toMultipartFile(resource, parent)).filter(Objects::nonNull).collect(Collectors.toList());
        world.setCursor(uploadService.uploadFiles(user, files));
    }

    @SneakyThrows
    private MockMultipartFile toMultipartFile(Resource resource, Path parent) {
        File file = resource.getFile();
        String name = parent.relativize(file.toPath()).toString();
        return file.isFile() ? new MockMultipartFile(name, name, null, FileCopyUtils.copyToByteArray(resource.getInputStream())) : null;
    }
}

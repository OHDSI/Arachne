package com.odysseusinc.arachne.glue;

import com.odysseusinc.arachne.datanode.analysis.UploadDTO;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO;
import com.odysseusinc.arachne.datanode.jpa.JpaConditional;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis_;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.AnalysisService;
import com.odysseusinc.arachne.datanode.util.Fn;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.testcontainers.shaded.org.awaitility.Awaitility;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.concurrent.TimeUnit;

public class AnalysisStep {

    @Autowired

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private World world;

    @Autowired
    private AnalysisWatcher watcher;

    @Autowired
    private AnalysisService analysisService;


    @When("Waiting for analysis to be initialized")
    public void waitInitialized() {
        Awaitility.await().atMost(60, TimeUnit.SECONDS).until(watcher::isInitialized);
    }

    @When("Waiting for analysis to receive update {int}")
    public void waitCallback(int count) {
        Awaitility.await().atMost(60, TimeUnit.SECONDS).until(() -> watcher.getStateCounts().get() == count);
    }

    @When("Waiting for analysis to completed")
    public void waitTerminated() {
        Awaitility.await().atMost(60, TimeUnit.SECONDS).until(watcher::isTerminated);
    }

    @When("User {string} runs {string} analysis on datasource {string}")
    public void run(String userName, String analysisName, String datasource) {
        Long datasourceId = Long.valueOf(world.ref(datasource));
        UploadDTO upload = (UploadDTO) world.getCursor();
        AnalysisRequestDTO request = Fn.create(AnalysisRequestDTO::new, dto -> {
            dto.setDatasourceId(datasourceId);
            dto.setType("IR");
            dto.setTitle(analysisName);
            dto.setExecutableFileName("Main.R");
        });
        User user = UserSteps.find(em, userName);
        world.setCursor(() -> analysisService.run(user, request, upload.getName()));
    }

    @When("Inspect {string} analysis")
    public void inspect(String title) {
        Analysis analysis = JpaSugar.select(em, Analysis.class).where(
                JpaConditional.has(Analysis_.title, title)
        ).getSingleResult();
        world.setCursor(analysis);
    }
}

package com.odysseusinc.arachne.glue;

import com.odysseusinc.arachne.datanode.analysis.UploadDTO;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO;
import com.odysseusinc.arachne.datanode.jpa.JpaConditional;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry_;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis_;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.AnalysisService;
import com.odysseusinc.arachne.datanode.util.Fn;
import com.odysseusinc.arachne.ee.TestAnalysis;
import com.odysseusinc.arachne.ee.TestExecutionEngineProcessor;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.testcontainers.shaded.org.awaitility.Awaitility;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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

    @Autowired
    private TestExecutionEngineProcessor processor;

    @Given("the following analyses:")
    public void theFollowingAnalyses(DataTable dataTable) {
        processor.addAnalyses(dataTable.asMaps().stream().map(row ->
                Fn.create(TestAnalysis::new, analysis -> {
                    analysis.setTitle(row.get("title"));
                    analysis.setExceptionRun(Boolean.parseBoolean(row.get("exceptionRun")));
                    analysis.setExceptionAbort(Boolean.parseBoolean(row.get("exceptionAbort")));
                    analysis.setExceptionFind(Boolean.parseBoolean(row.get("exceptionFind")));
                })
        ).collect(Collectors.toList()));
    }

    @Given("the following execution steps for {string}:")
    public void theFollowingExecutionStepsFor(String title, DataTable executionTable) {
        TestAnalysis analysis = processor.findAnalysisByTitle(title);
        analysis.getExecution().addAll(
                executionTable.asMaps().stream().map(row ->
                        Fn.create(TestAnalysis.Progress::new, progress -> {
                            progress.setStdout(row.get("stdout"));
                            progress.setError(row.get("error"));
                        })).collect(Collectors.toList())
        );
    }

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

    @When("User {string} cancels {string} analysis")
    public void cancel(String userName, String analysisName) {
        Long id = (Long) world.getCursor();
        User user = UserSteps.find(em, userName);
        analysisService.cancel(id, user);
    }

    @When("Inspect {string} analysis")
    public void inspectAnalysis(String title) {
        Analysis analysis = find(title);
        world.setCursor(analysis);
    }

    @When("Inspect {string} analysis state history")
    public void inspect(String title) {
        List<AnalysisStateEntry> analysisStates = JpaSugar.select(em, AnalysisStateEntry.class).where(
                JpaConditional.has(AnalysisStateEntry_.analysis, Analysis_.title, title)
        ).getResultList();
        world.setCursor(analysisStates);
    }

    private Analysis find(String title) {
        return JpaSugar.select(em, Analysis.class).where(
                JpaConditional.has(Analysis_.title, title)
        ).getSingleResult();
    }
}

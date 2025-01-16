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

package com.odysseusinc.arachne.glue;

import com.odysseusinc.arachne.datanode.analysis.UploadDTO;
import com.odysseusinc.arachne.datanode.controller.analysis.AnalysisCallbackController;
import com.odysseusinc.arachne.datanode.dto.analysis.AnalysisRequestDTO;
import com.odysseusinc.arachne.datanode.engine.ExecutionEngineSyncService;
import com.odysseusinc.arachne.datanode.jpa.JpaConditional;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisCommand;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisState;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry;
import com.odysseusinc.arachne.datanode.model.analysis.AnalysisStateEntry_;
import com.odysseusinc.arachne.datanode.model.analysis.Analysis_;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.AnalysisStateService;
import com.odysseusinc.arachne.datanode.service.analysis.AnalysisOrchestrator;
import com.odysseusinc.arachne.datanode.util.Fn;
import com.odysseusinc.arachne.ee.StubExecutionEngineClient;
import com.odysseusinc.arachne.ee.TestAnalysis;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisExecutionStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestTypeDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.ExecutionOutcome;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import com.odysseusinc.arachne.execution_engine_common.descriptor.dto.TarballEnvironmentDTO;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.testcontainers.shaded.com.google.common.collect.ImmutableMap;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
public class AnalysisStep {

    @Autowired
    @PersistenceContext
    private EntityManager em;

    @Autowired
    private World world;

    @Autowired
    private StubExecutionEngineClient engine;

    @Autowired
    private AnalysisCallbackController controller;

    @Autowired
    private AnalysisOrchestrator orchestrator;

    @Autowired
    private ExecutionEngineSyncService engineSyncService;

    private String currentAnalysis;

    @When("user {string} runs {string} analysis on datasource {string}")
    public void run(String userName, String analysisName, String datasource) {
        Long datasourceId = world.id(datasource);
        UploadDTO upload = (UploadDTO) world.getCursor();
        AnalysisRequestDTO request = Fn.create(AnalysisRequestDTO::new, dto -> {
            dto.setDatasourceId(datasourceId);
            dto.setType("IR");
            dto.setTitle(analysisName);
            dto.setExecutableFileName("Main.R");
        });
        User user = UserSteps.find(em, userName);
        world.setCursor(analysisName, Function.identity(), () ->
                orchestrator.run(user, request, upload.getName())
        );
        currentAnalysis = analysisName;
    }

    @When("user {string} cancels {string} analysis")
    public void cancel(String userName, String analysisName) {
        Long id = world.id(analysisName);
        User user = UserSteps.find(em, userName);
        orchestrator.cancel(id, user);
    }

    @When("Inspect {string} analysis")
    public void inspectAnalysis(String title) {
        Analysis analysis = find(title);
        world.setCursor(analysis);
    }

    @When("analysis state history is inspected")
    public void inspect() {
        inspect(currentAnalysis);
    }

    @When("analysis {string} state history is inspected")
    public void inspect(String title) {
        List<AnalysisStateEntry> analysisStates = JpaSugar.select(em, AnalysisStateEntry.class).where(
                JpaConditional.has(AnalysisStateEntry_.analysis, Analysis_.title, title)
        ).getResultList();
        world.setCursor(analysisStates.stream().map( s -> Fn.create(TestAnalysisStateEntry::new, state -> {
            state.setError(s.getError());
            state.setCommand(s.getCommand());
            state.setStage(s.getStage());
        })).collect(Collectors.toList()));
    }

    @Given("EE is initialized with tarball environments:")
    public void eeInit(DataTable dt) {
        engine.init(Fn.create(EngineStatus.Environments::new, environments -> {
            environments.setTarball(GenericSteps.createList(TarballEnvironmentDTO::new, dt));
        }));
    }

    @When("EE rejects cancel request with error {string}")
    public void eeRejectCancel(String error) {
        eeRejectCancel(currentAnalysis, error);
    }
    @When("EE rejects analysis {string} cancel request with error {string}")
    public void eeRejectCancel(String title, String error) {
        Long id = world.id(title);
        AnalysisResultDTO result = Fn.create(AnalysisResultDTO::new, status -> {
            status.setId(id);
            status.setStage(Stage.ABORT);
        });
        engine.getAnalyses().get(id).getCancelResponse().completeExceptionally(new RuntimeException(title));
    }

    @When("EE accepts cancel request")
    public void eeAcceptCancel() {
        eeAcceptCancel(currentAnalysis);
    }

    @When("EE accepts analysis {string} cancel request")
    public void eeAcceptCancel(String title) {
        Long id = world.id(title);
        AnalysisResultDTO result = Fn.create(AnalysisResultDTO::new, status -> {
            status.setId(id);
            status.setStage(Stage.ABORT);
        });
        engine.getAnalyses().get(id).getCancelResponse().complete(result);
    }

    @When("EE accepts with descriptor {string}")
    public void eeAccept(String descriptor) {
        eeAccept(currentAnalysis, descriptor);
    }

    @When("EE accepts analysis {string} with descriptor {string}")
    public void eeAccept(String title, String descriptor) {
        Long id = world.id(title);
        AnalysisRequestStatusDTO result = Fn.create(AnalysisRequestStatusDTO::new, status -> {
            status.setId(id);
            status.setActualDescriptorId(descriptor);
            status.setType(AnalysisRequestTypeDTO.R);
        });
        engine.getAnalyses().get(id).getResponse().complete(result);
    }


    @When("EE rejects with error {string}")
    public void eeReject(String error) {
        eeReject(currentAnalysis, error);
    }

    @When("EE rejects analysis {string} with error {string}")
    public void eeReject(String title, String error) {
        Long id = world.id(title);
        engine.getAnalyses().get(id).getResponse().completeExceptionally(new RuntimeException(error));
    }

    @When("EE sends update stage {string} stdout {string}")
    public void eeSendProgress(String stage, String stdout) {
        eeSendProgress(currentAnalysis, stage, stdout);
    }

    @When("EE progresses to stage {string} with stdout {string}")
    public void eeProgress(String stage, String stdout) {
        eeProgress(currentAnalysis, stage, stdout);
    }

    @When("EE progresses to stage {string} with stdout {string} and synchronize")
    public void eeProgressAndSync(String stage, String stdout) {
        eeProgress(currentAnalysis, stage, stdout);
        engineSyncService.checkStatus();
    }

    @When("EE sends analysis {string} update stage {string} stdout {string}")
    public void eeSendProgress(String title, String stage, String stdout) {
        Long id = world.id(title);
        AnalysisExecutionStatusDTO data = Fn.create(AnalysisExecutionStatusDTO::new, dto -> {
            dto.setId(id);
            dto.setStage(stage);
            dto.setStdout(stdout);
        });
        String password = engine.getAnalyses().get(id).getPassword();
        controller.updateSubmission(id, password, data);
    }

    @When("EE progresses {string} analysis to stage {string} with stdout {string}")
    public void eeProgress(String title, String stage, String stdout) {
        Long id = world.id(title);
        TestAnalysis testAnalysis = engine.getAnalyses().get(id);
        testAnalysis.setOutcome(new ExecutionOutcome(stage, null, stdout));
    }

    @When("EE sends result stage {string} error {string} stdout {string}")
    public void eeSendError(String stage, String error, String stdout) throws IOException {
        eeSendError(currentAnalysis, stage, error, stdout);
    }

    @When("EE sends analysis {string} result stage {string} error {string} stdout {string}")
    public void eeSendError(String title, String stage, String error, String stdout) throws IOException {
        Long id = world.id(title);
        AnalysisResultDTO result = Fn.create(AnalysisResultDTO::new, dto -> {
            dto.setId(id);
            dto.setStage(stage);
            dto.setStdout(stdout);
            dto.setError(error);
        });
        controller.analysisResult(id, "", result, new MultipartFile[]{});
    }

    @When("EE sends result stage {string} stdout {string}")
    public void eeSendResult(String stage, String stdout) throws IOException {
        eeSendResult(currentAnalysis, stage, stdout);
    }

    @When("EE sends analysis {string} result stage {string} stdout {string}")
    public void eeSendResult(String title, String stage, String stdout) throws IOException {
        Long id = world.id(title);
        AnalysisResultDTO result = Fn.create(AnalysisResultDTO::new, dto -> {
            dto.setId(id);
            dto.setStage(stage);
            dto.setStdout(stdout);
        });
        controller.analysisResult(id, "", result, new MultipartFile[]{});
    }

    @When("Clear the list of analyses in EE")
    public void clean() {
        engine.getAnalyses().clear();
    }

    @When("Synchronize the analyses from EE")
    public void syncAnalysisStatus() {
        engineSyncService.checkStatus();
    }

    private Analysis find(String title) {
        return JpaSugar.select(em, Analysis.class).where(
                JpaConditional.has(Analysis_.title, title)
        ).getSingleResult();
    }

    @Getter
    public static class TestAnalysisStateEntry extends AnalysisStateEntry {
        public AnalysisState getState() {
            return AnalysisStateService.toState(this.getError(), this.getCommand(), this.getStage());
        }
    }
}

package com.odysseusinc.arachne.glue;

import com.odysseusinc.arachne.datanode.engine.ExecutionEngineSyncService;
import com.odysseusinc.arachne.ee.AnalysisCallbackHandler;
import com.odysseusinc.arachne.ee.TestExecutionEngine;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;

public class AnalysisSyncStep {

    @Autowired
    private AnalysisCallbackHandler callbackHandler;

    @Autowired
    private ExecutionEngineSyncService engineSyncService;

    @Autowired
    private TestExecutionEngine executionEngine;

    @When("Sync analyses")
    public void syncAnalysisStatus() {
        engineSyncService.checkStatus();
    }

    @When("Disables EE callbacks")
    public  void disableCallbackHandler() {
        callbackHandler.setDisabled(true);
    }

    @When("Remove info about analyses on EE")
    public void removeAnalysisFromEE() {
        executionEngine.removeAnalyses();
    }

}

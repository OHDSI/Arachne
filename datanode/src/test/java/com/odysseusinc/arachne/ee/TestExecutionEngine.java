package com.odysseusinc.arachne.ee;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.INITIATE_CANCEL;
import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.COMPLETE_ANALYSIS;
import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.COMPLETE_CANCEL;
import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.EXECUTE_ANALYSIS;
import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.INITIATE;


@Slf4j
@Component
@RequiredArgsConstructor
public class TestExecutionEngine {

    private final TestExecutionEngineProcessor processor;

    public void run(Long id, String title, String password) {
        TestAnalysis testAnalysis = processor.findAnalysisByTitle(title);
        if (testAnalysis.isExceptionRun()) {
            throw new RuntimeException("Can't execute analysis " + testAnalysis.getTitle());
        }
        CompletableFuture.runAsync(() -> {
            testAnalysis.setId(id);
            testAnalysis.setPassword(password);
            processor.process(INITIATE, testAnalysis);
            processor.process(EXECUTE_ANALYSIS, testAnalysis);
            processor.process(COMPLETE_ANALYSIS, testAnalysis);
        });

    }

    public void abort(Long id) {
        TestAnalysis testAnalysis = processor.findAnalysisById(id);
        if (testAnalysis.isExceptionAbort()) {
            throw new RuntimeException("Can't abort analysis " + testAnalysis.getTitle());
        }
        CompletableFuture.runAsync(() -> {
            processor.process(INITIATE_CANCEL, testAnalysis);
            processor.process(COMPLETE_CANCEL, testAnalysis);
        });
    }

    public List<TestAnalysis> find(List<Long> ids) {
        List<TestAnalysis> analyses = processor.findAnalysisByIds(ids);
        if (analyses.stream().anyMatch(TestAnalysis::isExceptionFind)) {
            throw new RuntimeException("Can't find analyses");
        }
        return analyses;
    }


    public TestAnalysis find(Long id) {
        return processor.findAnalysisById(id);
    }

    public void removeAnalyses() {
        processor.removeAllAnalyses();
    }
}

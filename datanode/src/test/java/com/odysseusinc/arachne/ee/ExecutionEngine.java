package com.odysseusinc.arachne.ee;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.INITIATE_CANCEL;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.COMPLETE_ANALYSIS;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.COMPLETE_CANCEL;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.EXECUTE_ANALYSIS;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.INITIATE;


@Slf4j
@Component
@RequiredArgsConstructor
public class ExecutionEngine {

    private final ExecutionEngineProcessor processor;

    public void run(Long id, String title, String password) {
        CompletableFuture.runAsync(() -> {
            Analysis analysis = processor.findAnalysisByTitle(title);
            analysis.setId(id);
            analysis.setPassword(password);
            processor.process(INITIATE, analysis);
            processor.process(EXECUTE_ANALYSIS, analysis);
            processor.process(COMPLETE_ANALYSIS, analysis);
        });

    }

    public void abort(Long id) {
        CompletableFuture.runAsync(() -> {
            Analysis analysis = processor.findAnalysisById(id);
            processor.process(INITIATE_CANCEL, analysis);
            processor.process(COMPLETE_CANCEL, analysis);
        });
    }


    public Analysis find(Long id) {
        return processor.findAnalysisById(id);
    }

    public List<Analysis> find(List<Long> ids) {
        return processor.findAnalysisByIds(ids);
    }
}

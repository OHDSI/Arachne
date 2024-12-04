package com.odysseusinc.arachne.ee;

import com.odysseusinc.arachne.datanode.model.analysis.AnalysisState;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.CANCEL;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.FINISH;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.FINISH_CANCEL;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.RUN_ANALYSIS;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.START;


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
            processor.process(START, analysis);
            processor.process(RUN_ANALYSIS, analysis);
            processor.process(FINISH, analysis);
        });

    }

    public void abort(Long id) {
        CompletableFuture.runAsync(() -> {
            Analysis analysis = processor.findAnalysisById(id);
            processor.process(CANCEL, analysis);
            processor.process(FINISH_CANCEL, analysis);
        });
    }


    public Analysis find(Long id) {
        return processor.findAnalysisById(id);
    }

    public List<Analysis> find(List<Long> ids) {
        return processor.findAnalysisByIds(ids);
    }
}

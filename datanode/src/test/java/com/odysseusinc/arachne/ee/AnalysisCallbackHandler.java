package com.odysseusinc.arachne.ee;


import com.odysseusinc.arachne.datanode.controller.analysis.AnalysisCallbackController;
import com.odysseusinc.arachne.datanode.util.Fn;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisExecutionStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class AnalysisCallbackHandler {

    @Autowired
    private ApplicationEventPublisher publisher;

    @Lazy
    @Autowired
    private AnalysisCallbackController callbackController;

    @Setter
    private volatile boolean disabled;

    @EventListener(value = {TestAnalysisEvent.ExecuteProgress.class, TestAnalysisEvent.Initiated.class, TestAnalysisEvent.CancelInitiated.class})
    public void executeState(TestAnalysisEvent event) {
        if (!disabled) {
            TestAnalysis testAnalysis = event.getTestAnalysis();
            callbackController.updateSubmission(testAnalysis.getId(), testAnalysis.getPassword(), status(testAnalysis));
        }
        publisher.publishEvent(new EventProcessed(event));
    }


    @EventListener(value = {TestAnalysisEvent.Completed.class, TestAnalysisEvent.ExecuteFailed.class, TestAnalysisEvent.Canceled.class})
    public void finish(TestAnalysisEvent event) throws IOException {
        if (!disabled) {
            TestAnalysis testAnalysis = event.getTestAnalysis();
            callbackController.analysisResult(testAnalysis.getId(), testAnalysis.getPassword(), result(testAnalysis), new MultipartFile[]{});
        }
        publisher.publishEvent(new EventProcessed(event));
    }

    private AnalysisExecutionStatusDTO status(TestAnalysis testAnalysis){
        return Fn.create(AnalysisExecutionStatusDTO::new, dto -> {
            dto.setId(testAnalysis.getId());
            dto.setStage(testAnalysis.getStage());
        });
    }

    private AnalysisResultDTO result(TestAnalysis testAnalysis){
        return Fn.create(AnalysisResultDTO::new, dto -> {
            dto.setId(testAnalysis.getId());
            dto.setStage(testAnalysis.getStage());
            dto.setError(testAnalysis.getError());
        });
    }

    @Getter
    @AllArgsConstructor
    public static class EventProcessed {
        private TestAnalysisEvent event;
    }
}

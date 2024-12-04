package com.odysseusinc.arachne;


import com.odysseusinc.arachne.datanode.controller.analysis.AnalysisCallbackController;
import com.odysseusinc.arachne.datanode.util.Fn;
import com.odysseusinc.arachne.ee.Analysis;
import com.odysseusinc.arachne.ee.AnalysisEvent;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisExecutionStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
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

    @EventListener(value = {AnalysisEvent.ExecuteProgress.class, AnalysisEvent.Initialized.class})
    public void executeState(AnalysisEvent event) {
        Analysis analysis = event.getAnalysis();
        callbackController.updateSubmission(analysis.getId(), analysis.getPassword(), status(analysis));
        publisher.publishEvent(new EventProcessed(event));
    }

    @EventListener(value = {AnalysisEvent.Completed.class, AnalysisEvent.ExecuteFailed.class})
    public void finish(AnalysisEvent event) throws IOException {
        Analysis analysis = event.getAnalysis();
        callbackController.analysisResult(analysis.getId(), analysis.getPassword(), result(analysis), new MultipartFile[]{});
        publisher.publishEvent(new EventProcessed(event));
    }

    private AnalysisExecutionStatusDTO status(Analysis analysis){
        return Fn.create(AnalysisExecutionStatusDTO::new, dto -> {
            dto.setId(analysis.getId());
            dto.setStage(analysis.getStage());
        });
    }

    private AnalysisResultDTO result(Analysis analysis){
        return Fn.create(AnalysisResultDTO::new, dto -> {
            dto.setId(analysis.getId());
            dto.setStage(analysis.getStage());
            dto.setError(analysis.getError());
        });
    }

    @Getter
    @AllArgsConstructor
    public static class EventProcessed {
        private AnalysisEvent event;
    }
}

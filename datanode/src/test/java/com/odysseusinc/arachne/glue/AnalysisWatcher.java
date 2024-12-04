package com.odysseusinc.arachne.glue;

import com.odysseusinc.arachne.AnalysisCallbackHandler;
import com.odysseusinc.arachne.ee.AnalysisEvent;
import lombok.Getter;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Getter
@Component
public class AnalysisWatcher {

    private volatile boolean initialized;
    private volatile boolean terminated;
    private final AtomicInteger stateCounts = new AtomicInteger(0);

    @EventListener(AnalysisCallbackHandler.EventProcessed.class)
    public synchronized void updateSubmission(AnalysisCallbackHandler.EventProcessed event) {
        Object analysisEvent = event.getEvent();
        if (analysisEvent instanceof AnalysisEvent.Initialized) {
            initialized = true;
        } else if (analysisEvent instanceof AnalysisEvent.Completed || analysisEvent instanceof AnalysisEvent.ExecuteFailed) {
            terminated = true;
        } else if (analysisEvent instanceof AnalysisEvent.ExecuteProgress) {
            stateCounts.incrementAndGet();
        }
    }

}

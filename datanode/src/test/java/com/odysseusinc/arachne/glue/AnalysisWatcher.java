package com.odysseusinc.arachne.glue;

import com.odysseusinc.arachne.ee.AnalysisCallbackHandler;
import com.odysseusinc.arachne.ee.TestAnalysisEvent;
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
        if (analysisEvent instanceof TestAnalysisEvent.Initiated) {
            initialized = true;
        } else if (analysisEvent instanceof TestAnalysisEvent.Completed
                || analysisEvent instanceof TestAnalysisEvent.ExecuteFailed
                || analysisEvent instanceof TestAnalysisEvent.Canceled) {
            terminated = true;
        } else if (analysisEvent instanceof TestAnalysisEvent.ExecuteProgress) {
            stateCounts.incrementAndGet();
        }
    }

}

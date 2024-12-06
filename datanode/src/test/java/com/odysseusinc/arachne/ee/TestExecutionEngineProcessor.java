package com.odysseusinc.arachne.ee;

import com.google.common.base.Function;
import com.google.common.base.Supplier;
import com.odysseusinc.arachne.datanode.util.Fn;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.testcontainers.shaded.com.google.common.collect.ImmutableMap;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.COMPLETE_ANALYSIS;
import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.COMPLETE_CANCEL;
import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.EXECUTE_ANALYSIS;
import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.INITIATE;
import static com.odysseusinc.arachne.ee.TestExecutionEngineProcessor.Command.INITIATE_CANCEL;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.ABORT;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.ABORTED;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.COMPLETED;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.EXECUTE;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.INITIALIZE;


@Slf4j
@Component
public class TestExecutionEngineProcessor {
    private static final Set<String> INACTIVE_STAGES = new HashSet<>(Arrays.asList(Stage.ABORT, Stage.ABORTED, Stage.COMPLETED));
    @Value("${executionEngine.test.delay}")
    private long delay;
    private final List<TestAnalysis> analyses = new ArrayList<>();
    private final ApplicationEventPublisher publisher;
    private final Map<Command, StageTransition> stageTransitions = ImmutableMap.of(
            INITIATE, Fn.create(StageTransition::new, tr -> {
                tr.setTo(INITIALIZE);
                tr.setPre(this::delay);
                tr.setPost(a -> event(TestAnalysisEvent.Initiated::new, a));
            }),
            EXECUTE_ANALYSIS, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(INITIALIZE);
                tr.setTo(EXECUTE);
                tr.setPre(this::delay);
                tr.setPost(a -> event(TestAnalysisEvent.Executed::new, a));
            }),
            COMPLETE_ANALYSIS, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(EXECUTE);
                tr.setTo(COMPLETED);
                tr.setPre(this::execution);
                tr.setPost(a -> event(TestAnalysisEvent.Completed::new, a));
            }),
            INITIATE_CANCEL, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(EXECUTE);
                tr.setTo(ABORT);
                tr.setPre(this::delay);
                tr.setPost(a -> event(TestAnalysisEvent.CancelInitiated::new, a));
            }),
            COMPLETE_CANCEL, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(ABORT);
                tr.setTo(ABORTED);
                tr.setPre(this::delay);
                tr.setPost(a -> event(TestAnalysisEvent.Canceled::new, a));
            })
    );

    @Autowired
    public TestExecutionEngineProcessor(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    public void process(Command action, TestAnalysis testAnalysis) {
        Optional.ofNullable(stageTransitions.get(action)).ifPresent(stageTransition ->
                stageTransition.handleStage(testAnalysis)
        );
    }

    private boolean execution(TestAnalysis testAnalysis) {
        try {
            List<TestAnalysis.Progress> progresses = testAnalysis.getExecution();
            for (int i = 0; i < progresses.size(); i++) {
                if (INACTIVE_STAGES.contains(testAnalysis.getStage())) {
                    log.info("Aborting execution for analysis [{}] at step [{}] as it is not active (stage: [{}]).", testAnalysis.getId(), i + 1, testAnalysis.getStage());
                    return false;
                }
                TestAnalysis.Progress progress = progresses.get(i);
                TimeUnit.MILLISECONDS.sleep(delay);
                if (progress.getError() == null) {
                    log.info("Progress [{}]: {}", i + 1, progress.getStdout());
                    event(TestAnalysisEvent.ExecuteProgress::new, testAnalysis);
                } else {
                    log.error("Execution failed at step [{}]: {}", i + 1, progress.getError());
                    testAnalysis.setError(progress.getError());
                    event(TestAnalysisEvent.ExecuteFailed::new, testAnalysis);
                    return false;
                }
            }
            log.info("Execution completed successfully for analysis [{}].", testAnalysis.getId());
            return true;
        } catch (Throwable e) {
            log.error("Unexpected error during execution for analysis [{}]: {}", testAnalysis.getId(), e.getMessage(), e);
            testAnalysis.setError("Unexpected execution failure.");
            event(TestAnalysisEvent.ExecuteFailed::new, testAnalysis);
            return false;
        }
    }

    private boolean delay(TestAnalysis testAnalysis) {
        try {
            TimeUnit.MILLISECONDS.sleep(delay);
            return true;
        } catch (Throwable e) {
            log.error("Unexpected error during transition for analysis [{}]: {}", testAnalysis.getId(), e.getMessage(), e);
            testAnalysis.setError("Unexpected execution failure.");
            event(TestAnalysisEvent.ExecuteFailed::new, testAnalysis);
            return false;
        }
    }

    private void event(Supplier<TestAnalysisEvent> eventSupplier, TestAnalysis testAnalysis) {
        log.info("Preparing to publish event for analysis [{}] at stage [{}].", testAnalysis.getId(), testAnalysis.getStage());
        try {
            TestAnalysisEvent event = Fn.create(eventSupplier, e -> e.setTestAnalysis(testAnalysis));
            publisher.publishEvent(event);
            log.info("Successfully published event [{}] for analysis [{}] at stage [{}].", event.getClass().getSimpleName(), testAnalysis.getId(), testAnalysis.getStage());
        } catch (Throwable e) {
            log.error("Failed to publish event for analysis [{}] at stage [{}]: {}", testAnalysis.getId(), testAnalysis.getStage(), e.getMessage(), e);
            throw new RuntimeException("Event publication failed", e);
        }
    }

    public List<TestAnalysis> findAnalysisByIds(List<Long> ids) {
        return analyses.stream().filter(analysis -> ids.contains(analysis.getId())).collect(Collectors.toList());
    }

    public TestAnalysis findAnalysisById(Long id) {
        return analyses.stream().filter(analysis -> Objects.equals(analysis.getId(), id)).findFirst().orElseThrow(() ->
                new RuntimeException("Analysis with ID " + id + " not found.")
        );
    }

    public TestAnalysis findAnalysisByTitle(String title) {
        return analyses.stream().filter(analysis -> Objects.equals(analysis.getTitle(), title)).findFirst().orElseThrow(() ->
                new RuntimeException("Analysis with title '" + title + "' not found.")
        );
    }

    public void addAnalyses(Collection<TestAnalysis> analyses) {
        this.analyses.addAll(analyses);
    }

    public void removeAllAnalyses() {
        analyses.clear();
    }

    public enum Command {
        INITIATE, EXECUTE_ANALYSIS, INITIATE_CANCEL, COMPLETE_ANALYSIS, COMPLETE_CANCEL
    }

    @Getter
    @Setter
    public static class StageTransition {
        public static final int TRANSITION_DELAY = 50;
        private String from;
        private String to;
        private Function<TestAnalysis, Boolean> pre;
        private Consumer<TestAnalysis> post;

        public void handleStage(TestAnalysis testAnalysis) {
            try {
                if (!Objects.equals(testAnalysis.getStage(), from)) {
                    //todo that should be error event here.
                    testAnalysis.setError("Invalid stage: Expected " + from + ", but found " + testAnalysis.getStage());
                }
                String predefinedFailure = testAnalysis.getPredefinedFailures().get(from);
                if (predefinedFailure == null) {
                    Boolean success = Optional.ofNullable(pre).map(a -> a.apply(testAnalysis)).orElse(true);
                    if (success) {
                        testAnalysis.setStage(to);
                        log.info("Stage transition for analysis {}: {} -> {}", testAnalysis.getId(), from, to);
                        Optional.ofNullable(post).ifPresent(a -> a.accept(testAnalysis));
                    }
                } else {
                    //todo that should be error event here.
                    testAnalysis.setError(predefinedFailure);
                    log.error("Predefined failure for analysis {} at stage {}: {}", testAnalysis.getId(), from, predefinedFailure);
                }
            } catch (Exception e) {
                String errorMessage = "Unexpected error during stage transition for analysis " + testAnalysis.getId();
                testAnalysis.setError(errorMessage);
                log.error(errorMessage, e);
            }
        }
    }
}

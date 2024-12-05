package com.odysseusinc.arachne.ee;

import com.google.common.base.Function;
import com.google.common.base.Supplier;
import com.odysseusinc.arachne.datanode.util.Fn;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.testcontainers.shaded.com.google.common.collect.ImmutableMap;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.COMPLETE_ANALYSIS;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.COMPLETE_CANCEL;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.EXECUTE_ANALYSIS;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.INITIATE;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.INITIATE_CANCEL;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.ABORT;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.ABORTED;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.COMPLETED;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.EXECUTE;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.INITIALIZE;


@Slf4j
@Component
@RequiredArgsConstructor
public class ExecutionEngineProcessor {

    private static final Set<String> INACTIVE_STAGES = new HashSet<>(Arrays.asList(Stage.ABORT, Stage.ABORTED, Stage.COMPLETED));


    private final ApplicationEventPublisher publisher;
    private final List<Analysis> analyses;
    private final Map<Command, StageTransition> stageTransitions = ImmutableMap.of(
            INITIATE, Fn.create(StageTransition::new, tr -> {
                tr.setTo(INITIALIZE);
                tr.setPost(a -> publishEvent(AnalysisEvent.Initiated::new, a));
            }),
            EXECUTE_ANALYSIS, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(INITIALIZE);
                tr.setTo(EXECUTE);
                tr.setPost(a -> publishEvent(AnalysisEvent.Executed::new, a));

            }),
            COMPLETE_ANALYSIS, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(EXECUTE);
                tr.setTo(COMPLETED);
                tr.setPre(this::execution);
                tr.setPost(a -> publishEvent(AnalysisEvent.Completed::new, a));
            }),
            INITIATE_CANCEL, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(EXECUTE);
                tr.setTo(ABORT);
                tr.setPost(a -> publishEvent(AnalysisEvent.CancelInitiated::new, a));
            }),
            COMPLETE_CANCEL, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(ABORT);
                tr.setTo(ABORTED);
                tr.setPre(this::cancel);
                tr.setPost(a -> publishEvent(AnalysisEvent.Canceled::new, a));
            })
    );

    @Autowired
    public ExecutionEngineProcessor(TestAnalysisConfig analysisConfig, ApplicationEventPublisher publisher) {
        this(publisher, analysisConfig.getAnalyses());
    }

    public void process(Command action, Analysis analysis) {
        Optional.ofNullable(stageTransitions.get(action)).ifPresent(stageTransition ->
                stageTransition.handleStage(analysis)
        );
    }

    private boolean execution(Analysis analysis) {
        try {
            List<Analysis.Progress> progresses = analysis.getExecution();
            for (int i = 0; i < progresses.size(); i++) {
                if (INACTIVE_STAGES.contains(analysis.getStage())) {
                    log.info("Aborting execution for analysis [{}] at step [{}] as it is not active (stage: [{}]).", analysis.getId(), i + 1, analysis.getStage());
                    return false;
                }
                Analysis.Progress progress = progresses.get(i);
                TimeUnit.MILLISECONDS.sleep(analysis.getExecutionDelay());
                if (progress.getError() == null) {
                    log.info("Progress [{}]: {}", i + 1, progress.getStdout());
                    publishEvent(AnalysisEvent.ExecuteProgress::new, analysis);
                } else {
                    log.error("Execution failed at step [{}]: {}", i + 1, progress.getError());
                    analysis.setError(progress.getError());
                    publishEvent(AnalysisEvent.ExecuteFailed::new, analysis);
                    return false;
                }
            }
            log.info("Execution completed successfully for analysis [{}].", analysis.getId());
            return true;
        } catch (Throwable e) {
            log.error("Unexpected error during execution for analysis [{}]: {}", analysis.getId(), e.getMessage(), e);
            analysis.setError("Unexpected execution failure.");
            publishEvent(AnalysisEvent.ExecuteFailed::new, analysis);
            return false;
        }
    }

    private boolean cancel(Analysis analysis) {
        try {
            TimeUnit.MILLISECONDS.sleep(analysis.getExecutionDelay() );
            log.info("Progress: Aborted");
            return true;
        } catch (Throwable e) {
            log.error("Unexpected error during aborting for analysis [{}]: {}", analysis.getId(), e.getMessage(), e);
            analysis.setError("Unexpected execution failure.");
            publishEvent(AnalysisEvent.ExecuteFailed::new, analysis);
            return false;
        }
    }

    private void publishEvent(Supplier<AnalysisEvent> eventSupplier, Analysis analysis) {
        log.info("Preparing to publish event for analysis [{}] at stage [{}].", analysis.getId(), analysis.getStage());
        try {
            AnalysisEvent event = Fn.create(eventSupplier, e -> e.setAnalysis(analysis));
            publisher.publishEvent(event);
            log.info("Successfully published event [{}] for analysis [{}] at stage [{}].", event.getClass().getSimpleName(), analysis.getId(), analysis.getStage());
        } catch (Throwable e) {
            log.error("Failed to publish event for analysis [{}] at stage [{}]: {}", analysis.getId(), analysis.getStage(), e.getMessage(), e);
            throw new RuntimeException("Event publication failed", e);
        }
    }

    public List<Analysis> findAnalysisByIds(List<Long> ids) {
        return analyses.stream().filter(analysis -> ids.contains(analysis.getId())).collect(Collectors.toList());
    }

    public Analysis findAnalysisById(Long id) {
        return analyses.stream().filter(analysis -> Objects.equals(analysis.getId(), id)).findFirst().orElseThrow(() ->
                new RuntimeException("Analysis with ID " + id + " not found.")
        );
    }

    public Analysis findAnalysisByTitle(String title) {
        return analyses.stream().filter(analysis -> Objects.equals(analysis.getTitle(), title)).findFirst().orElseThrow(() ->
                new RuntimeException("Analysis with title '" + title + "' not found.")
        );
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
        private Function<Analysis, Boolean> pre;
        private Consumer<Analysis> post;

        public void handleStage(Analysis analysis) {
            try {
                if (!Objects.equals(analysis.getStage(), from)) {
                    //todo that should be error event here.
                    analysis.setError("Invalid stage: Expected " + from + ", but found " + analysis.getStage());
                    return;
                }

                String predefinedFailure = analysis.getPredefinedFailures().get(from);
                if (predefinedFailure == null) {
                    Boolean success = Optional.ofNullable(pre).map(a -> a.apply(analysis)).orElse(true);
                    if (success) {
                        analysis.setStage(to);
                        log.info("Stage transition for analysis {}: {} -> {}", analysis.getId(), from, to);
                        Optional.ofNullable(post).ifPresent(a -> a.accept(analysis));
                    }
                } else {
                    //todo that should be error event here.
                    analysis.setError(predefinedFailure);
                    log.error("Predefined failure for analysis {} at stage {}: {}", analysis.getId(), from, predefinedFailure);
                }
            } catch (Exception e) {
                String errorMessage = "Unexpected error during stage transition for analysis " + analysis.getId();
                analysis.setError(errorMessage);
                log.error(errorMessage, e);
            }
        }
    }
}

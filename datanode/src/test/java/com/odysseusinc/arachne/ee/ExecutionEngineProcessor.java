package com.odysseusinc.arachne.ee;

import com.google.common.base.Function;
import com.google.common.base.Supplier;
import com.odysseusinc.arachne.datanode.util.Fn;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.testcontainers.shaded.com.google.common.collect.ImmutableMap;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.CANCEL;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.FINISH;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.FINISH_CANCEL;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.RUN_ANALYSIS;
import static com.odysseusinc.arachne.ee.ExecutionEngineProcessor.Command.START;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.ABORT;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.ABORTED;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.COMPLETED;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.EXECUTE;
import static com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage.INITIALIZE;


@Slf4j
@Component
@RequiredArgsConstructor
public class ExecutionEngineProcessor {
    private final ApplicationEventPublisher publisher;
    private final List<Analysis> analyses;
    private final Map<Command, StageTransition> stageTransitions = ImmutableMap.of(
            START, Fn.create(StageTransition::new, tr -> {
                tr.setTo(INITIALIZE);
                tr.setPost(a -> publishEvent(AnalysisEvent.Initialized::new, a));
            }),
            RUN_ANALYSIS, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(INITIALIZE);
                tr.setTo(EXECUTE);
                tr.setPost(a -> publishEvent(AnalysisEvent.Executed::new, a));
            }),
            FINISH, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(EXECUTE);
                tr.setTo(COMPLETED);
                tr.setPre(this::execution);
                tr.setPost(a -> publishEvent(AnalysisEvent.Completed::new, a));
            }),
            CANCEL, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(EXECUTE);
                tr.setTo(ABORT);
            }),
            FINISH_CANCEL, Fn.create(StageTransition::new, tr -> {
                tr.setFrom(ABORT);
                tr.setTo(ABORTED);
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
        START, RUN_ANALYSIS, CANCEL, FINISH, FINISH_CANCEL
    }

    @Getter
    @Setter
    public static class StageTransition {
        private String from;
        private String to;
        private Function<Analysis, Boolean> pre;
        private Consumer<Analysis> post;

        public void handleStage(Analysis analysis) {
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
        }
    }
}

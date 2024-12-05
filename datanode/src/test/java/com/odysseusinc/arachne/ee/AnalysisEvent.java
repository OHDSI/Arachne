package com.odysseusinc.arachne.ee;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class AnalysisEvent {
    private Analysis analysis;

    public static class Initiated extends AnalysisEvent {
    }
    public static class ExecuteProgress extends AnalysisEvent {
    }
    public static class ExecuteFailed extends AnalysisEvent {
    }
    public static class Executed extends AnalysisEvent {
    }
    public static class Completed extends AnalysisEvent {
    }
    public static class CancelInitiated extends AnalysisEvent {
    }
    public static class Canceled extends AnalysisEvent {
    }
}

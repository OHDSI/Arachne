package com.odysseusinc.arachne.ee;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class TestAnalysisEvent {
    private TestAnalysis testAnalysis;

    public static class Initiated extends TestAnalysisEvent {
    }
    public static class ExecuteProgress extends TestAnalysisEvent {
    }
    public static class ExecuteFailed extends TestAnalysisEvent {
    }
    public static class Executed extends TestAnalysisEvent {
    }
    public static class Completed extends TestAnalysisEvent {
    }
    public static class CancelInitiated extends TestAnalysisEvent {
    }
    public static class Canceled extends TestAnalysisEvent {
    }
}

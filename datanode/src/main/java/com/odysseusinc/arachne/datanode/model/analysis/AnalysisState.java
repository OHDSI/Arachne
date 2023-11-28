package com.odysseusinc.arachne.datanode.model.analysis;

import lombok.Getter;

public enum AnalysisState {
    CREATED(false),
    EXECUTION_FAILURE(true),
    EXECUTING(false),
    EXECUTED(true),
    CLOSED(true),
    DEAD(true);

    @Getter
    final boolean terminal;

    AnalysisState(boolean terminal) {
        this.terminal = terminal;
    }

}

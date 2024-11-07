/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.odysseusinc.arachne.datanode.model.analysis;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum AnalysisState {
    CREATED(false, 1),
    EXECUTING(false, 2),
    EXECUTED(true, 3),
    EXECUTION_FAILURE(true, 5),
    ABORT_FAILURE(true, 6),
    ABORTING(false, 7),
    ABORTED(true, 8),
    DEAD(true, 9),
    UNKNOWN(false, 10);

    public static final List<AnalysisState> TERMINAL_STATES = Arrays.stream(values()).filter(AnalysisState::isTerminal).collect(Collectors.toList());

    @Getter
    private final boolean terminal;
    @Getter
    private final int priority;

    AnalysisState(boolean terminal, int priority) {
        this.terminal = terminal;
        this.priority = priority;
    }

}

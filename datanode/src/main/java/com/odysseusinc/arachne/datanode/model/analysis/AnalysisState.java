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

/**
 * This status is generated based on the AnalysisCommand and EE Stage.
 * It is used solely to simplify sorting and filtering. Please avoid using it in any logic.
 */
public enum AnalysisState {

    INITIALIZE,
    EXECUTE,
    COMPLETED(true),
    ABORT,
    ABORTED(true),
    DEAD(true),
    FAILED(true),
    UNKNOWN;

    public static final List<AnalysisState> TERMINAL_VALUES = Arrays.stream(AnalysisState.values()).filter(AnalysisState::isTerminal).collect(Collectors.toList());

    @Getter
    final boolean terminal;


    AnalysisState() {
        terminal = false;
    }

    AnalysisState(boolean terminal) {
        this.terminal = terminal;
    }
}

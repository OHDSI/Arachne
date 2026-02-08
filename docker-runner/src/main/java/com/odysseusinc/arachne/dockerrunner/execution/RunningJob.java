/*
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
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

package com.odysseusinc.arachne.dockerrunner.execution;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.ExecutionOutcome;

import java.time.Instant;
import java.util.concurrent.CompletableFuture;

public class RunningJob {
    private final AnalysisRequestDTO request;
    private final String containerId;
    private final Instant started;
    private final StringBuffer stdout;
    private final CompletableFuture<ExecutionOutcome> result;

    public RunningJob(AnalysisRequestDTO request, String containerId, Instant started, StringBuffer stdout, CompletableFuture<ExecutionOutcome> result) {
        this.request = request;
        this.containerId = containerId;
        this.started = started;
        this.stdout = stdout;
        this.result = result;
    }

    public AnalysisRequestDTO getRequest() { return request; }
    public String getContainerId() { return containerId; }
    public Instant getStarted() { return started; }
    public StringBuffer getStdout() { return stdout; }
    public CompletableFuture<ExecutionOutcome> getResult() { return result; }
}

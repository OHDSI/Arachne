/*
 * Copyright 2024 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.ee;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.ExecutionOutcome;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.Stage;

import java.util.concurrent.CompletableFuture;

public class TestAnalysis {
    private final String title;
    private final String password;
    private final byte[] bytes;
    private final CompletableFuture<AnalysisRequestStatusDTO> response;

    private volatile ExecutionOutcome outcome = new ExecutionOutcome(Stage.INITIALIZE, null, "Accepted in test Execution Engine");
    private volatile CompletableFuture<AnalysisResultDTO> cancelResponse;

    public TestAnalysis(String title, String password, byte[] bytes, CompletableFuture<AnalysisRequestStatusDTO> response) {
        this.title = title;
        this.password = password;
        this.bytes = bytes;
        this.response = response;
    }

    public String getTitle() { return title; }
    public String getPassword() { return password; }
    public byte[] getBytes() { return bytes; }
    public CompletableFuture<AnalysisRequestStatusDTO> getResponse() { return response; }
    public ExecutionOutcome getOutcome() { return outcome; }
    public void setOutcome(ExecutionOutcome outcome) { this.outcome = outcome; }
    public CompletableFuture<AnalysisResultDTO> getCancelResponse() { return cancelResponse; }
    public void setCancelResponse(CompletableFuture<AnalysisResultDTO> cancelResponse) { this.cancelResponse = cancelResponse; }
}
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
package com.odysseusinc.arachne.datanode.service.client.engine;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class EngineClientConfig {

    @Value("${executionEngine.protocol}")
    private String protocol;
    @Value("${executionEngine.host}")
    private String host;
    @Value("${executionEngine.port}")
    private String port;
    @Value("${executionEngine.analysisUri}")
    private String analysisUri;
    @Value("${executionEngine.descriptorsUri}")
    private String descriptorsUri;
    @Value("${executionEngine.token}")
    private String token;
    @Value("${proxy.enabledForEngine}")
    private Boolean proxyEnabledForEngine;

}

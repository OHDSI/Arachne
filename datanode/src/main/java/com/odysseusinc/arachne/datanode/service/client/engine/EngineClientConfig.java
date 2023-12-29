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

import com.odysseusinc.arachne.datanode.service.client.ArachneHttpClientBuilder;
import com.odysseusinc.arachne.datanode.service.client.FeignSpringFormEncoder;
import com.odysseusinc.arachne.datanode.util.RestUtils;
import feign.Feign;
import feign.codec.Decoder;
import feign.codec.StringDecoder;
import feign.jackson.JacksonDecoder;
import feign.slf4j.Slf4jLogger;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

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

    private final ArachneHttpClientBuilder arachneHttpClientBuilder;

    public EngineClientConfig(ArachneHttpClientBuilder arachneHttpClientBuilder) {

        this.arachneHttpClientBuilder = arachneHttpClientBuilder;
    }

    @Bean
    @Primary
    public EngineClient engineClient(){
        return getEngineClient(new JacksonDecoder());
    }

    @Bean("engineStatusClient")
    public EngineClient engineStatusClient(){
        return getEngineClient(new StringDecoder());
    }

    private EngineClient getEngineClient(Decoder decoder) {
        String url = String.format("%s://%s:%s", protocol, host, port);
        return Feign.builder()
                .client(arachneHttpClientBuilder.build(proxyEnabledForEngine))
                .encoder(new FeignSpringFormEncoder())
                .decoder(decoder)
                .requestInterceptor(rt -> rt.header("Authorization", RestUtils.checkCredentials(token)))
                .logger(new Slf4jLogger(EngineClient.class))
                .logLevel(feign.Logger.Level.FULL)
                .target(EngineClient.class, url);
    }
}

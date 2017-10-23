/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: August 22, 2017
 *
 */

package com.odysseusinc.arachne.datanode.service.client.portal;

import com.odysseusinc.arachne.datanode.service.client.atlas.AtlasClient;
import com.odysseusinc.arachne.datanode.service.client.encoders.MultipartEncoder;
import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.slf4j.Slf4jLogger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CentralClientConfig {

    @Value("${datanode.arachneCentral.host}")
    private String centralHost;
    @Value("${datanode.arachneCentral.port}")
    private Integer centralPort;

    private final CentralSystemRequestInterceptor centralSystemRequestInterceptor;
    private final CentralRequestInterceptor centralRequestInterceptor;

    public CentralClientConfig(CentralSystemRequestInterceptor centralSystemRequestInterceptor,
                               CentralRequestInterceptor centralRequestInterceptor) {

        this.centralSystemRequestInterceptor = centralSystemRequestInterceptor;
        this.centralRequestInterceptor = centralRequestInterceptor;
    }

    @Bean
    public CentralSystemClient centralSystemClient() {

        return Feign.builder()
                .encoder(new MultipartEncoder(new JacksonEncoder()))
                .decoder(new JacksonDecoder())
                .requestInterceptor(centralSystemRequestInterceptor)
                .logger(new Slf4jLogger(AtlasClient.class))
                .logLevel(feign.Logger.Level.FULL)
                .target(CentralSystemClient.class, centralHost + ":" + centralPort);
    }

    @Bean
    public CentralClient centralClient() {

        return Feign.builder()
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .requestInterceptor(centralRequestInterceptor)
                .logger(new Slf4jLogger(AtlasClient.class))
                .logLevel(feign.Logger.Level.FULL)
                .target(CentralClient.class, centralHost + ":" + centralPort);
    }
}
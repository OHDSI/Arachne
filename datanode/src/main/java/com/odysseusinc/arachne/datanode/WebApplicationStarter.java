/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableAsync
@EnableScheduling
@EnableJpaRepositories(basePackages = {"com.odysseusinc.arachne.*"})
@EntityScan(basePackages = {"com.odysseusinc.arachne.*"})
@EnableAspectJAutoProxy
@EnableEncryptableProperties
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com.odysseusinc.arachne.*", "org.ohdsi.authenticator.*"})
public class WebApplicationStarter {

    private static volatile ConfigurableApplicationContext context;
    private static String[] args;

    public static void main(String... argc) {
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
        args = argc;
        context = SpringApplication.run(WebApplicationStarter.class, args);
    }

    public static void restart() {
        SpringApplication.exit(context);
        context = SpringApplication.run(WebApplicationStarter.class, args);
    }

    public Jackson2ObjectMapperBuilderCustomizer objectMapperBuilderCustomizer() {

        return new Jackson2ObjectMapperBuilderCustomizer() {
            @Override
            public void customize(Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder) {

                jackson2ObjectMapperBuilder.featuresToEnable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
            }
        };
    }
}

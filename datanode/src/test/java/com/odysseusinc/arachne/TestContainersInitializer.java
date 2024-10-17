/*
 * Copyright 2021, 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne;

import java.util.stream.Stream;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.MapPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.lifecycle.Startables;
import org.testcontainers.shaded.com.google.common.collect.ImmutableMap;

public class TestContainersInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15.8");

    private static void startContainers() {
        Startables.deepStart(Stream.of(
                postgres
                // we can add further containers here, e.g. solr
        )).join();
    }

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        startContainers();
        MapPropertySource testcontainers = new MapPropertySource("testcontainers", ImmutableMap.of(
                "spring.datasource.url", postgres.getJdbcUrl(),
                "spring.datasource.username", postgres.getUsername(),
                "spring.datasource.password", postgres.getPassword()
        ));
        context.getEnvironment().getPropertySources().addFirst(testcontainers);
    }
}

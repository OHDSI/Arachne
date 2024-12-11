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

package com.odysseusinc.arachne.datanode;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.core.env.MapPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.shaded.com.google.common.collect.ImmutableMap;
import org.testcontainers.utility.DockerImageName;

import java.util.Map;
import java.util.UUID;

import static org.testcontainers.containers.PostgreSQLContainer.IMAGE;


@Slf4j
public class LocalEnvironmentInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    private static final DockerImageName POSTGRES_IMAGE = DockerImageName.parse(IMAGE).withTag("16.2");
    private static final Map<String, PostgreSQLContainer<?>> containers = ImmutableMap.of(
            "datanode", createPostgreSQLContainer("datanode")
    );

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        containers.forEach((name, container) -> {
            container.start();
        });

        Map<String, Object> properties = ImmutableMap.<String, Object>builder()
                .put("spring.datasource.url", containers.get("datanode").getJdbcUrl())
                .put("spring.datasource.username", containers.get("datanode").getUsername())
                .put("spring.datasource.password", containers.get("datanode").getPassword())
                .build();

        properties.forEach((key, value) -> log.info("Configuration - {}: {}", key, value));

        context.getEnvironment().getPropertySources().addFirst(new MapPropertySource("testcontainers", properties));

        ApplicationListener<ContextClosedEvent> onClose =
                event -> containers.values().forEach(GenericContainer::stop);
        context.addApplicationListener(onClose);
    }

    private static PostgreSQLContainer<?> createPostgreSQLContainer(String databaseName) {
        return new PostgreSQLContainer<>(POSTGRES_IMAGE)
                .withDatabaseName(databaseName)
                .withUsername("ohdsi").withPassword("ohdsi")
                .withCreateContainerCmdModifier(cmd -> cmd.withName(databaseName + "_" + UUID.randomUUID()));
    }
}

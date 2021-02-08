/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Authors: Pavel Grafkin, Alexandr Ryabokon
 * Created: April 19, 2017
 *
 */

package com.odysseusinc.arachne.system.settings.config;

import com.ulisesbocchio.jasyptspringboot.EncryptablePropertyResolver;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.ConfigurableEnvironment;

@Configuration
@ComponentScan("com.ulisesbocchio.jasyptspringboot")
public class SpringPropertiesConfig {

    private static final String SQL = "SELECT * FROM system_settings WHERE value IS NOT NULL";
    private static final Logger LOG = LoggerFactory.getLogger(SpringPropertiesConfig.class);

    private Connection getConnection(EncryptablePropertyResolver encryptablePropertyResolver, ConfigurableEnvironment environment)
            throws SQLException {

        final String datasourceUrl = environment.getProperty("spring.datasource.url");
        final String datasourceUsername = environment.getProperty("spring.datasource.username");
        final String datasourcePassword = environment.getProperty("spring.datasource.password");
        final String connectionUrl = encryptablePropertyResolver.resolvePropertyValue(datasourceUrl);
        final String user = encryptablePropertyResolver.resolvePropertyValue(datasourceUsername);
        final String password = encryptablePropertyResolver.resolvePropertyValue(datasourcePassword);
        return DriverManager.getConnection(connectionUrl, user, password);
    }

    private Map<String, Object> getDbProperties(Connection connection, EncryptablePropertyResolver encryptablePropertyResolver) throws SQLException {

        Map<String, Object> loadedProperties = new HashMap<>();

        try (Statement statement = connection.createStatement()) {
            try (ResultSet rs = statement.executeQuery(SQL)) {
                while (rs.next()) {
                    String name = rs.getString("name");
                    String value = rs.getString("value");
                    value = encryptablePropertyResolver.resolvePropertyValue(value);
                    loadedProperties.put(name, value);
                }
            }
        }
        return loadedProperties;
    }

    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer(
            EncryptablePropertyResolver encryptablePropertyResolver, ConfigurableEnvironment environment
    ) throws SQLException {

        Properties dbProps = new Properties();
        try (Connection connection = getConnection(encryptablePropertyResolver, environment)) {
            dbProps.putAll(getDbProperties(connection, encryptablePropertyResolver));
        } catch (SQLException e) {
            LOG.error("Error loading properties", e);
        }

        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();

        configurer.setProperties(dbProps);
        configurer.setLocalOverride(true);

        return configurer;
    }

}
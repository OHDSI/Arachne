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
import java.io.IOException;
import java.net.URI;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.sql.DataSource;
import org.postgresql.ds.PGPoolingDataSource;
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

       private DataSource getDataSource(EncryptablePropertyResolver encryptablePropertyResolver, ConfigurableEnvironment environment)
               throws IOException, ClassNotFoundException, IllegalAccessException, InstantiationException, SQLException {

            final String datasourceUrl = environment.getProperty("spring.datasource.url");
            final String datasourceUsername = environment.getProperty("spring.datasource.username");
            final String datasourcePassword = environment.getProperty("spring.datasource.password");
            final String connectionUrl = encryptablePropertyResolver.resolvePropertyValue(datasourceUrl);
            final String user = encryptablePropertyResolver.resolvePropertyValue(datasourceUsername);
            final String password = encryptablePropertyResolver.resolvePropertyValue(datasourcePassword);
            DriverManager.registerDriver((Driver) Class.forName("org.postgresql.Driver").newInstance());
            final String cleanURI = connectionUrl.substring(5);
            final URI uri = URI.create(cleanURI);
            final PGPoolingDataSource ds = new PGPoolingDataSource();
            ds.setServerName(uri.getHost());
            ds.setPortNumber(uri.getPort());
            ds.setDatabaseName(uri.getPath().substring(1));
            ds.setUser(user);
            ds.setPassword(password);
            ds.setMaxConnections(10);
        return ds;
    }

    private Map getDbProperties(DataSource dataSource, EncryptablePropertyResolver encryptablePropertyResolver) {

        Map<String, Object> loadedProperties = new HashMap<>();

        try {
            Connection connection = dataSource.getConnection();
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
        } catch (SQLException e) {
            LOG.error("Error loading properties", e);
        }

        return loadedProperties;
    }

    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer(
            EncryptablePropertyResolver encryptablePropertyResolver, ConfigurableEnvironment environment
    ) throws IOException, ClassNotFoundException, IllegalAccessException, InstantiationException, SQLException {

        DataSource dataSource = getDataSource(encryptablePropertyResolver, environment);
        Properties dbProps = new Properties();
        dbProps.putAll(getDbProperties(dataSource, encryptablePropertyResolver));

        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();

        configurer.setProperties(dbProps);
        configurer.setLocalOverride(true);

        return configurer;
    }

}
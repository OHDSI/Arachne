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
import org.springframework.core.io.ClassPathResource;

@Configuration
@ComponentScan("com.ulisesbocchio.jasyptspringboot")
public class SpringPropertiesConfig {

    private static final String SQL = "select * from system_settings where value IS NOT NULL";
    private static final Logger LOG = LoggerFactory.getLogger(SpringPropertiesConfig.class);

    private DataSource getDataSource(EncryptablePropertyResolver encryptablePropertyResolver)
            throws IOException, ClassNotFoundException, IllegalAccessException, InstantiationException {

        Properties properties = new Properties();
        properties.load(new ClassPathResource("application.properties").getInputStream());
        PGPoolingDataSource ds = new PGPoolingDataSource();
        try {
            String connectionUrl = encryptablePropertyResolver.resolvePropertyValue((String) properties.get("spring.datasource.url"));
            String user = encryptablePropertyResolver.resolvePropertyValue((String) properties.get("spring.datasource.username"));
            String password = encryptablePropertyResolver.resolvePropertyValue((String) properties.get("spring.datasource.password"));

            DriverManager.registerDriver((Driver) Class.forName("org.postgresql.Driver").newInstance());
            String cleanURI = connectionUrl.substring(5);
            URI uri = URI.create(cleanURI);
            ds.setServerName(uri.getHost());
            ds.setPortNumber(uri.getPort());
            ds.setDatabaseName(uri.getPath().substring(1));
            ds.setUser(user);
            ds.setPassword(password);
            ds.setMaxConnections(10);
        } catch (SQLException ex) {
            LOG.error(ex.getMessage(), ex);
        }
        return ds;
    }

    private Map getDbProperties(DataSource dataSource) {

        Map<String, Object> loadedProperties = new HashMap<>();

        try {
            Connection connection = dataSource.getConnection();
            try (Statement statement = connection.createStatement()) {
                try (ResultSet rs = statement.executeQuery(SQL)) {
                    while (rs.next()) {
                        String name = rs.getString("name");
                        String value = rs.getString("value");
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
            EncryptablePropertyResolver encryptablePropertyResolver
    ) throws IOException, ClassNotFoundException, IllegalAccessException, InstantiationException {

        DataSource dataSource = getDataSource(encryptablePropertyResolver);
        Properties dbProps = new Properties();
        dbProps.putAll(getDbProperties(dataSource));

        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();

        configurer.setProperties(dbProps);
        configurer.setLocalOverride(true);

        return configurer;
    }

}
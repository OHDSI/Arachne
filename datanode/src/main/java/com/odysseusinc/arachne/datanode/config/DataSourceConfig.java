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
package com.odysseusinc.arachne.datanode.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.hibernate5.encryptor.HibernatePBEEncryptorRegistry;
import org.jasypt.util.password.PasswordEncryptor;
import org.jasypt.util.password.StrongPasswordEncryptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

@Configuration
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceConfig extends HikariConfig {

    @Value("${spring.datasource.url}")
    private String jdbcUrl;
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;
    @Value("${jasypt.encryptor.password}")
    private String password;
    @Value("${jasypt.encryptor.algorithm}")
    private String algorithm;

    @Primary
    @Bean
    public DataSource primaryDataSource() {

        defaultStringEncryptor();
        setDriverClassName(driverClassName);
        setJdbcUrl(jdbcUrl);
        return new HikariDataSource(this);
    }

    @PostConstruct
    public PasswordEncryptor defaultStringEncryptor() {

        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setProvider(new BouncyCastleProvider());
        encryptor.setProviderName("BC");
        encryptor.setAlgorithm(algorithm);
        encryptor.setKeyObtentionIterations(1000);
        encryptor.setPassword(password);
        HibernatePBEEncryptorRegistry.getInstance()
                .registerPBEStringEncryptor("defaultStringEncryptor", encryptor);
        return new StrongPasswordEncryptor();
    }
}

/*
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
 * Created: November 18, 2016
 *
 */

package com.odysseusinc.arachne.datanode.config;

import feign.Client;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
public class IntegrationConfig {
    private static final Logger log = LoggerFactory.getLogger(IntegrationConfig.class);

    @Value("${proxy.enabled}")
    private Boolean proxyEnabled;
    @Value("${proxy.host}")
    private String proxyHost;
    @Value("${proxy.port}")
    private Integer proxyPort;
    @Value("${proxy.auth.enabled}")
    private Boolean proxyAuthEnabled;
    @Value("${proxy.auth.username}")
    private String proxyUsername;
    @Value("${proxy.auth.password}")
    private String proxyPassword;

    @Value("${proxy.enabledForEngine}")
    private Boolean proxyEnabledForEngine;

    @Bean(name = "centralRestTemplate")
    public RestTemplate centralRestTemplate(@Qualifier("integration") CloseableHttpClient httpClient) {

        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(httpClient));
        restTemplate.getMessageConverters().add(new ByteArrayHttpMessageConverter());
        return restTemplate;
    }

    @Bean(name = "executionEngineRestTemplate")
    public RestTemplate executionEngineRestTemplate(@Qualifier("executionEngine") CloseableHttpClient httpClient) {

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        factory.setConnectionRequestTimeout(1000 * 60 * 7);
        factory.setConnectTimeout(1000 * 60 * 7);
        factory.setReadTimeout(1000 * 60 * 7);
        return new RestTemplate(factory);
    }

    @Bean(name = "atlasRestTemplate")
    public RestTemplate atlasRestTemplate(@Qualifier("integration") CloseableHttpClient httpClient) {

        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(httpClient));
        restTemplate.getMessageConverters().add(new ByteArrayHttpMessageConverter());
        return restTemplate;
    }

    @Configuration
    @ConditionalOnProperty(value = "server.ssl.strictMode", havingValue = "false")
    public class nonStrictSSLSecurityConfig {

        private CloseableHttpClient buildHttpClient(ProxyDetails proxyDetails) {

            TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {

                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {

                            return null;
                        }

                        @Override
                        public void checkClientTrusted(
                                java.security.cert.X509Certificate[] certs, String authType) {

                        }

                        @Override
                        public void checkServerTrusted(
                                java.security.cert.X509Certificate[] certs, String authType) {

                        }
                    }
            };

            CloseableHttpClient closeableHttpClient = null;
            try {
                SSLContext sc = SSLContext.getInstance("SSL");
                sc.init(null, trustAllCerts, new java.security.SecureRandom());
                SSLSocketFactory socketFactory = sc.getSocketFactory();
                HttpsURLConnection.setDefaultSSLSocketFactory(socketFactory);
                HttpHost proxy = null;
                CredentialsProvider credentialsProvider = null;

                if (proxyDetails.isProxyEnabled()) {
                    proxy = new HttpHost(proxyDetails.getProxyHost(), proxyDetails.getProxyPort());
                    if (proxyDetails.isProxyAuthEnabled()) {
                        credentialsProvider = new BasicCredentialsProvider();
                        credentialsProvider.setCredentials(
                                new AuthScope(proxyDetails.getProxyHost(), proxyDetails.getProxyPort()),
                                new UsernamePasswordCredentials(proxyDetails.getProxyUsername(), proxyDetails.getProxyPassword()));
                    }
                }

                HttpClientBuilder httpClientBuilder = HttpClients.custom();

                if (proxy != null) {
                    httpClientBuilder.setProxy(proxy);
                    if (credentialsProvider != null) {
                        httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
                    }
                }

                HostnameVerifier nonStrictVerifier = (s, sslSession) -> true;
                HttpsURLConnection.setDefaultHostnameVerifier(nonStrictVerifier);
                SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sc, nonStrictVerifier);

                closeableHttpClient = httpClientBuilder.setSSLSocketFactory(csf).build();
            } catch (KeyManagementException | NoSuchAlgorithmException ex) {
                log.error("", ex);
            }
            return closeableHttpClient;
        }

        @Bean
        public Client getClient() {

            return new Client.Default(null, NoopHostnameVerifier.INSTANCE);
        }

        @Bean
        @Qualifier("integration")
        public CloseableHttpClient getIntegrationHttpClient() {

            ProxyDetails proxyDetails = new ProxyDetails(proxyEnabled, proxyHost, proxyPort, proxyAuthEnabled, proxyUsername, proxyPassword);
            return buildHttpClient(proxyDetails);
        }

        @Bean
        @Qualifier("executionEngine")
        public CloseableHttpClient getExecEngineHttpClient() {

            ProxyDetails proxyDetails = new ProxyDetails(proxyEnabledForEngine, proxyHost, proxyPort, proxyAuthEnabled, proxyUsername, proxyPassword);
            return buildHttpClient(proxyDetails);
        }
    }

    @Configuration
    @ConditionalOnProperty(value = "server.ssl.strictMode", havingValue = "true")
    public class strictSSLSecurityConfig {

        private CloseableHttpClient buildHttpClient(ProxyDetails proxyDetails) {

            HttpClientBuilder httpClientBuilder = HttpClients.custom();
            CredentialsProvider credentialsProvider = null;
            if (proxyDetails.isProxyEnabled()) {
                httpClientBuilder.setProxy(new HttpHost(proxyDetails.getProxyHost(), proxyDetails.getProxyPort()));
                if (proxyDetails.isProxyAuthEnabled()) {
                    credentialsProvider = new BasicCredentialsProvider();
                    credentialsProvider.setCredentials(
                            new AuthScope(proxyDetails.getProxyHost(), proxyDetails.getProxyPort()),
                            new UsernamePasswordCredentials(proxyDetails.getProxyUsername(), proxyDetails.getProxyPassword()));
                    httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
                }
            }
            return httpClientBuilder.build();
        }

        @Bean
        @Qualifier("integration")
        public CloseableHttpClient getIntegrationHttpClient() {

            ProxyDetails proxyDetails = new ProxyDetails(proxyEnabled, proxyHost, proxyPort, proxyAuthEnabled, proxyUsername, proxyPassword);
            return buildHttpClient(proxyDetails);
        }

        @Bean
        @Qualifier("executionEngine")
        public CloseableHttpClient getExecEngineHttpClient() {

            ProxyDetails proxyDetails = new ProxyDetails(proxyEnabledForEngine, proxyHost, proxyPort, proxyAuthEnabled, proxyUsername, proxyPassword);
            return buildHttpClient(proxyDetails);
        }
    }

    public class ProxyDetails {

        private boolean proxyEnabled;
        private String proxyHost;
        private Integer proxyPort;
        private boolean proxyAuthEnabled;
        private String proxyUsername;
        private String proxyPassword;

        public ProxyDetails(boolean proxyEnabled) {

            this.proxyEnabled = proxyEnabled;
        }

        public ProxyDetails(boolean proxyEnabled, String proxyHost, Integer proxyPort, Boolean proxyAuthEnabled, String proxyUsername, String proxyPassword) {

            this.proxyEnabled = proxyEnabled;
            this.proxyHost = proxyHost;
            this.proxyPort = proxyPort;
            this.proxyAuthEnabled = proxyAuthEnabled;
            this.proxyUsername = proxyUsername;
            this.proxyPassword = proxyPassword;
        }

        public boolean isProxyEnabled() {

            return proxyEnabled;
        }

        public String getProxyHost() {

            return proxyHost;
        }

        public Integer getProxyPort() {

            return proxyPort;
        }

        public boolean isProxyAuthEnabled() {

            return proxyAuthEnabled;
        }

        public String getProxyUsername() {

            return proxyUsername;
        }

        public String getProxyPassword() {

            return proxyPassword;
        }
    }
}

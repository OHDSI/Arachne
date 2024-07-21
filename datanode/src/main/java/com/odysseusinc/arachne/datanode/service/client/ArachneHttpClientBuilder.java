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
package com.odysseusinc.arachne.datanode.service.client;

import okhttp3.Authenticator;
import okhttp3.Credentials;
import okhttp3.OkHttpClient;
import org.apache.commons.net.util.TrustManagerUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

@Service
public class ArachneHttpClientBuilder {

    private static final Logger LOGGER = LoggerFactory.getLogger(ArachneHttpClientBuilder.class);

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

    @Value("${server.ssl.strictMode:false}")
    private Boolean sslStrictMode;

    public static TrustManager[] getTrustAllCertsManager() {

        return new TrustManager[]{
                new X509TrustManager() {

                    @Override
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {

                        return new java.security.cert.X509Certificate[]{};
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
    }

    public static SSLSocketFactory getTrustAllSSLSocketFactory() throws KeyManagementException, NoSuchAlgorithmException {
        SSLContext sc = SSLContext.getInstance("SSL");
        sc.init(null, getTrustAllCertsManager(), new java.security.SecureRandom());
        return sc.getSocketFactory();
    }

    public OkHttpClient buildOkHttpClient(boolean proxyEnabled) {

        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        if (proxyEnabled) {

            builder.proxy(new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyHost, proxyPort)));

            if (proxyAuthEnabled) {
                Authenticator proxyAuthenticator = (route, response) -> {
                    String credential = Credentials.basic(proxyUsername, proxyPassword);
                    return response.request().newBuilder()
                            .header("Proxy-Authorization", credential)
                            .build();
                };
                builder.proxyAuthenticator(proxyAuthenticator);
                LOGGER.info("Using proxy with authentication for Feign client");
            } else {
                LOGGER.info("Using proxy for Feign client");
            }
        }

        if (!sslStrictMode) {
            try {
                SSLSocketFactory sslSocketFactory = getTrustAllSSLSocketFactory();
                final X509TrustManager trustManager = TrustManagerUtils.getAcceptAllTrustManager();
                builder.sslSocketFactory(sslSocketFactory, trustManager);
                HttpsURLConnection.setDefaultSSLSocketFactory(sslSocketFactory);
                builder.hostnameVerifier((hostname, session) -> true);
            } catch (KeyManagementException | NoSuchAlgorithmException ex) {
                LOGGER.error("Cannot disable strict SSL mode", ex);
            }
        }

        return builder.build();
    }
}

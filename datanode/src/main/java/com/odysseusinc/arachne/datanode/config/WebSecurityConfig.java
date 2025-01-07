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

import com.odysseusinc.arachne.datanode.Api;
import com.odysseusinc.arachne.datanode.auth.oidc.OidcSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private OidcSuccessHandler authenticationSuccessHandler;

    @Value("${datanode.jwt.header}")
    private String tokenHeader;

    @Autowired(required = false)
    private OAuth2ClientProperties oAuth2ClientProperties;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        if (oAuth2ClientProperties != null) {
            http.oauth2Login(oauth -> oauth
                    .successHandler(authenticationSuccessHandler)
                    .userInfoEndpoint(endpoint -> endpoint.oidcUserService(new OidcUserService()))
            );
        }
        http.csrf(
                AbstractHttpConfigurer::disable
        ).sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        ).exceptionHandling(
                this::bearerExceptionHandler
        ).oauth2ResourceServer(
                OAuth2ResourceServerConfigurer::jwt
        ).authorizeHttpRequests(auth -> {
            auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
            auth.requestMatchers(
                    "/index.html", "/css/**",
                    "/",
                    "/js/**",
                    "/fonts/**",
                    "/img/**",
                    "/auth/login**",
                    "/auth/register**",
                    "/api/v1/build-number**",
                    "/data-catalog**",
                    "/cdm-source-list/data-sources**",
                    "/cdm-source-list/data-sources/**",
                    "/api/v1/auth/logout**",
                    "/api/v1/auth/login**",
                    "/api/v1/auth/login/**",
                    "/api/v1/auth/register**",
                    "/api/v1/auth/refresh**",
                    "/api/v1/auth/method**",
                    "/api/v1/auth/mode**",
                    "/api/v1/auth/password-policies**",
                    "/api/v1/user-management/professional-types**",
                    "/api/v1/user-management/countries/**",
                    "/api/v1/user-management/state-province/**",
                    "/api/v1/auth/registration**",
                    "/api/v1/auth/remind-password/**",
                    "/configuration/**",
                    "/api/v1/submissions/**",
                    "/admin-settings/**",
                    "/api/v1/datanode/mode"

            ).permitAll();
            auth.requestMatchers("/api/v1/admin/**").hasAuthority("SCOPE_ADMIN");
            auth.requestMatchers(Api.PREFIX + "/*/*" + Api.SUFFIX_STATUS, Api.PREFIX + "/*/*" + Api.SUFFIX_RESULT).permitAll();
            auth.requestMatchers("/api**").authenticated();
            auth.requestMatchers("/api/**").authenticated();
            auth.anyRequest().permitAll();
        });
        return http.build();
    }

    private ExceptionHandlingConfigurer<HttpSecurity> bearerExceptionHandler(ExceptionHandlingConfigurer<HttpSecurity> exceptions) {
        return exceptions
                .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                .accessDeniedHandler(new BearerTokenAccessDeniedHandler());
    }
}

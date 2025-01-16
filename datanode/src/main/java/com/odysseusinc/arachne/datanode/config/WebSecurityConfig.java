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
import com.odysseusinc.arachne.datanode.security.AuthenticationTokenFilter;
import com.odysseusinc.arachne.datanode.security.EntryPointUnauthorizedHandler;
import org.ohdsi.authenticator.service.authentication.AccessTokenResolver;
import org.ohdsi.authenticator.service.authentication.AuthenticationMode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final EntryPointUnauthorizedHandler unauthorizedHandler;

    @Value("${datanode.jwt.header}")
    private String tokenHeader;

    @Value("${security.authentication.mode:" + AuthenticationMode.Const.STANDARD + "}")
    private AuthenticationMode authenticationMode = AuthenticationMode.STANDARD;

    public WebSecurityConfig(EntryPointUnauthorizedHandler unauthorizedHandler) {
        this.unauthorizedHandler = unauthorizedHandler;
    }


    @Bean
    public AuthenticationTokenFilter authenticationTokenFilterBean() {

        return new AuthenticationTokenFilter();
    }

    @Bean
    public FilterRegistrationBean<AuthenticationTokenFilter> authenticationTokenFilterRegistration(AuthenticationTokenFilter filter) {
        FilterRegistrationBean<AuthenticationTokenFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(filter);
        registrationBean.setEnabled(false);
        return registrationBean;
    }


    @Bean
    public AccessTokenResolver accessTokenResolver() {
        return new AccessTokenResolver(tokenHeader, authenticationMode);
    }

    @Bean
    protected SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                .csrf(
                        AbstractHttpConfigurer::disable
                ).sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                ).exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(unauthorizedHandler))
                .authorizeHttpRequests(auth -> {
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
                    auth.requestMatchers("/api/v1/admin/**").hasRole("ADMIN");
                    auth.requestMatchers(Api.PREFIX + "/*/*" + Api.SUFFIX_STATUS, Api.PREFIX + "/*/*" + Api.SUFFIX_RESULT).permitAll();
                    auth.requestMatchers("/api**").authenticated();
                    auth.requestMatchers("/api/**").authenticated();
                    auth.anyRequest().permitAll();
                });
        http.addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
        return  http.build();
    }

}

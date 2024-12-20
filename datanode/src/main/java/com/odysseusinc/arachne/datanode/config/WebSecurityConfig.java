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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private EntryPointUnauthorizedHandler unauthorizedHandler;

    @Value("${datanode.jwt.header}")
    private String tokenHeader;

    @Value("${security.authentication.mode:" + AuthenticationMode.Const.STANDARD + "}")
    private AuthenticationMode authenticationMode = AuthenticationMode.STANDARD;

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

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(unauthorizedHandler)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .antMatchers("/index.html", "/css/**").permitAll()
                .antMatchers("/").permitAll()
                .antMatchers("/js/**").permitAll()
                .antMatchers("/fonts/**").permitAll()
                .antMatchers("/img/**").permitAll()
                .antMatchers("/auth/login**").permitAll()
                .antMatchers("/auth/register**").permitAll()
                .antMatchers("/api/v1/build-number**").permitAll()
                .antMatchers("/data-catalog**").permitAll()
                .antMatchers("/cdm-source-list/data-sources**").permitAll()
                .antMatchers("/cdm-source-list/data-sources/**").permitAll()
                .antMatchers("/api/v1/auth/logout**").permitAll()
                .antMatchers("/api/v1/auth/login**").permitAll()
                .antMatchers("/api/v1/auth/register**").permitAll()
                .antMatchers("/api/v1/auth/refresh**").permitAll()
                .antMatchers("/api/v1/auth/method**").permitAll()
                .antMatchers("/api/v1/auth/mode**").permitAll()
                .antMatchers("/api/v1/auth/password-policies**").permitAll()
                .antMatchers("/api/v1/user-management/professional-types**").permitAll()
                .antMatchers("/api/v1/user-management/countries/**").permitAll()
                .antMatchers("/api/v1/user-management/state-province/**").permitAll()
                .antMatchers("/api/v1/auth/registration**").permitAll()
                .antMatchers("/api/v1/auth/remind-password/**").permitAll()
                .antMatchers("/configuration/**").permitAll()
                .antMatchers("/api/v1/submissions/**").permitAll()
                .antMatchers("/admin-settings/**").permitAll()
                .antMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .antMatchers(Api.PREFIX + "/*/*" + Api.SUFFIX_STATUS, Api.PREFIX + "/*/*"  + Api.SUFFIX_RESULT).permitAll()
                .antMatchers("/api/v1/datanode/mode").permitAll()

                .antMatchers("/api**").authenticated()
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll();
        http
                .addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
    }
}

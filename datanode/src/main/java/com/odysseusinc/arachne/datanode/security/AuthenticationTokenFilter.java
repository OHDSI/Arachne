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

package com.odysseusinc.arachne.datanode.security;

import com.odysseusinc.arachne.datanode.controller.AuthController;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.service.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.ohdsi.authenticator.service.authentication.AccessTokenResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.filter.GenericFilterBean;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Slf4j
public class AuthenticationTokenFilter extends GenericFilterBean {

    @Autowired
    private AccessTokenResolver accessTokenResolver;

    @Autowired
    private AuthenticationService authenticationService;

    @Value("${security.method}")
    private String authMethod;

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {


        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String headerName = accessTokenResolver.getTokenHeaderName();
        String accessToken = getTokenFromCookie(headerName, httpRequest).orElseGet(() ->
                httpRequest.getHeader(headerName)
        );

        if (StringUtils.isNotEmpty(accessToken)) {
            try {
                authenticationService.authenticate(authMethod, accessToken, httpRequest, (HttpServletResponse) response, token -> AuthController.authCookie(token, -1, accessTokenResolver));
            } catch (AuthenticationException | AuthException | org.ohdsi.authenticator.exception.AuthenticationException ex) {
                logAuthenticationException(httpRequest, ex);
            }
        }
        chain.doFilter(request, response);
    }

    private void logAuthenticationException(HttpServletRequest httpRequest, RuntimeException ex) {
        if (HttpMethod.OPTIONS.matches(httpRequest.getMethod())) {
            return;
        }
        log.debug("Authentication failed", ex);
    }

    private static Optional<String> getTokenFromCookie(String cookieName, HttpServletRequest httpRequest) {
        return Optional.ofNullable(httpRequest.getCookies()).flatMap(cookies ->
                Arrays.stream(cookies).filter(cookie ->
                        StringUtils.isNotEmpty(cookie.getName())
                ).filter(cookie ->
                        cookie.getName().equalsIgnoreCase(cookieName)
                ).map(Cookie::getValue).filter(StringUtils::isNotEmpty).findAny()
        );
    }

}

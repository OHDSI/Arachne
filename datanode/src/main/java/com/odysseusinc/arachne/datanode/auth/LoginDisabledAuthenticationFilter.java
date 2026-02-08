/*
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
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

package com.odysseusinc.arachne.datanode.auth;

import com.odysseusinc.arachne.datanode.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.stream.Collectors;

/**
 * When login is disabled, injects a default user as the principal for unauthenticated requests
 * so that all API endpoints work without requiring a real login.
 */
@Component
public class LoginDisabledAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(LoginDisabledAuthenticationFilter.class);

    @Value("${security.loginDisabled:true}")
    private boolean loginDisabled;

    @Value("${security.anonymousUsername:admin}")
    private String anonymousUsername;

    private final UserRepository userRepository;

    public LoginDisabledAuthenticationFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (!loginDisabled) {
            filterChain.doFilter(request, response);
            return;
        }
        if (SecurityContextHolder.getContext().getAuthentication() != null
                && SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            filterChain.doFilter(request, response);
            return;
        }
        userRepository.findOneByUsernameIgnoreCase(anonymousUsername)
                .filter(user -> user.getEnabled() == null || user.getEnabled())
                .map(user -> {
                    Collection<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                            .map(role -> new SimpleGrantedAuthority(
                                    "SCOPE_" + role.getName().replace("ROLE_", "")))
                            .collect(Collectors.toList());
                    return new LoginDisabledAuthentication(user.getId(), authorities);
                })
                .ifPresentOrElse(
                        auth -> SecurityContextHolder.getContext().setAuthentication(auth),
                        () -> log.warn("Login disabled but anonymous user [{}] not found or disabled", anonymousUsername)
                );
        filterChain.doFilter(request, response);
    }
}

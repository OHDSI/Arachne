/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.service.impl;

import com.odysseusinc.arachne.datanode.controller.Authenticator;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.AuthenticationService;
import com.odysseusinc.arachne.datanode.service.UserRegistrationStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.ohdsi.authenticator.converter.TokenInfoToTokenConverter;
import org.ohdsi.authenticator.service.authentication.AuthenticationMode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Objects;
import java.util.function.Function;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final Authenticator authenticator;
    private final UserDetailsService userDetailsService;
    private final UserRegistrationStrategy userRegisterStrategy;
    @Value("${security.authentication.mode:" + AuthenticationMode.Const.STANDARD + "}")
    private AuthenticationMode authenticationMode = AuthenticationMode.STANDARD;

    @Override
    public Authentication authenticate(
            String authMethod, String accessToken, HttpServletRequest httpRequest, HttpServletResponse response, Function<String, String> cookie
    ) {

        if (StringUtils.isNotEmpty(accessToken)) {
            String username = authenticator.resolveUsername(accessToken);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                createUserByTokenIfNecessary(username);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, accessToken, userDetails.getAuthorities());
                if (Objects.nonNull(httpRequest)) {
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                }
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String path = httpRequest.getServletPath();
                if (!path.endsWith("submissions")) {
                    TokenInfoToTokenConverter tokenConverter = authenticator.getTokenInfoToTokenConverter();
                    // Parsing doesn't include expiration date, so serialization will set a new expiration date
                    String token = tokenConverter.toToken(tokenConverter.toTokenInfo(accessToken));
                    String apply = cookie.apply(token);
                    response.setHeader(HttpHeaders.SET_COOKIE, apply);
                }

                return authentication;
            }
        }
        return null;
    }

    private void createUserByTokenIfNecessary(String username) {

        if (authenticationMode == AuthenticationMode.STANDARD) {
            return;
        }
        if (StringUtils.isEmpty(username)) {
            throw new AuthException("Username cannot be empty.");
        }
        User user = getUserByUserEmail(username);
        userRegisterStrategy.registerUser(user);
    }

    private User getUserByUserEmail(String email) {

        String name = StringUtils.split(email, "@")[0];
        User user = new User();
        user.setFirstName(name);
        user.setLastName(StringUtils.EMPTY);
        user.setEmail(email);
        user.setUsername(email);
        return user;
    }

}

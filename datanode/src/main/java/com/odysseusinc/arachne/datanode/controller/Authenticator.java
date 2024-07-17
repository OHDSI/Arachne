/*
 * Copyright 2024 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.controller;

import lombok.Getter;
import org.ohdsi.authenticator.converter.TokenInfoToTokenConverter;
import org.ohdsi.authenticator.converter.TokenInfoToUserInfoConverter;
import org.ohdsi.authenticator.exception.MethodNotSupportedAuthenticationException;
import org.ohdsi.authenticator.model.TokenInfo;
import org.ohdsi.authenticator.model.UserInfo;
import org.ohdsi.authenticator.service.AuthService;
import org.ohdsi.authenticator.service.authentication.AuthServiceProvider;
import org.ohdsi.authenticator.service.authentication.TokenProvider;
import org.pac4j.core.credentials.Credentials;
import org.springframework.stereotype.Service;

@Getter
@Service
public class Authenticator {
    private final TokenProvider tokenProvider;
    private final AuthServiceProvider authServiceProvider;
    private final TokenInfoToTokenConverter tokenInfoToTokenConverter;
    private final TokenInfoToUserInfoConverter tokenInfoToUserInfoConverter;

    public Authenticator(TokenProvider tokenProvider, AuthServiceProvider authServiceProvider) {
        this.tokenProvider = tokenProvider;
        this.authServiceProvider = authServiceProvider;
        this.tokenInfoToTokenConverter = new TokenInfoToTokenConverter(tokenProvider);
        this.tokenInfoToUserInfoConverter = new TokenInfoToUserInfoConverter();
    }

    public UserInfo authenticate(String method, Credentials request) {
        AuthService authService = authServiceProvider.getByMethod(method).orElseThrow(MethodNotSupportedAuthenticationException::new);
        TokenInfo authentication = authService.authenticate(request);
        String token = tokenInfoToTokenConverter.toToken(authentication);
        return tokenInfoToUserInfoConverter.toUserInfo(authentication, token);
    }

    public String resolveUsername(String token) {
        return tokenProvider.resolveValue(token, "sub", String.class);
    }

    public UserInfo refreshToken(String token) {
        TokenInfo tokenInfo = tokenInfoToTokenConverter.toTokenInfo(token);
        AuthService authService = authServiceProvider.getByMethod(tokenInfo.getAuthMethod()).orElseThrow(MethodNotSupportedAuthenticationException::new);
        TokenInfo newAuthentication = authService.refreshToken(tokenInfo);
        String newToken = tokenInfoToTokenConverter.toToken(newAuthentication);
        return tokenInfoToUserInfoConverter.toUserInfo(newAuthentication, newToken);
    }

    public void invalidateToken(String token) {
        this.tokenProvider.invalidateToken(token);
    }
}

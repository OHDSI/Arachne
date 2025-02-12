/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
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

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2AccessToken.TokenType;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.server.resource.BearerTokenErrors;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CookieBearerTokenResolver implements BearerTokenResolver {

    public String resolve(HttpServletRequest request) {
        Stream<Cookie> cookies = Optional.ofNullable(request.getCookies()).map(Stream::of).orElseGet(Stream::empty);
        return cookies.filter(cookie ->
                TokenType.BEARER.getValue().equals(cookie.getName())
        ).reduce((a, b) -> {
            throw new OAuth2AuthenticationException(BearerTokenErrors.invalidRequest("Multiple bearer cookies in the request"));
        }).map(Cookie::getValue).orElse(null);
    }

}

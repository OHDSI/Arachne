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

import com.odysseusinc.arachne.datanode.util.Fn;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.OAuth2AccessToken.TokenType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static java.time.format.DateTimeFormatter.RFC_1123_DATE_TIME;

/**
 * Utility class to group methods related to JWT token manipulation
 */
@Service
public class JwtTokens {
    private final Duration expiry;
    @Autowired
    private JwtEncoder jwtEncoder;
    /**
     * Surprisingly enough, JwtTimestampValidator is advanced enough to grab Clock bean if available.
     * So we also inject clock here to make sure these 2 things always match (and can work in time-manupulating tests too)
     */
    @Autowired
    private Clock clock;

    public JwtTokens(@Value("${jwt.expiry:P1D}") String expiry) {
        this.expiry = Duration.parse(expiry);
    }

    /**
     * @param provider provider name.
     * @param user Authenticated user info.
     */
    public Cookie cookie(String provider, String user, List<String> roles) {
        Jwt token = newToken(provider, user, roles);
        return cookie(token.getTokenValue(), token.getExpiresAt());
    }

    public Cookie cookieLogout() {
        return cookie("-", clock.instant());
    }

    public Cookie cookie(String tokenValue, Instant expiresAt) {
        // BearerTokenAuthenticationFilter is invoked for all requests, even those configured as .permitAll() !
        // This will also include JwtTimestampValidator that will hard fail throwing an exception, resulting in unwanted 401
        // This is a known issue, see https://github.com/spring-attic/spring-security-oauth/issues/723
        // (and the workaround described there is not applicable anymore due to DSL changes)
        // So we ensure that cookie will expire at the very same moment as JWT token.
        String expires = RFC_1123_DATE_TIME.format(OffsetDateTime.ofInstant(expiresAt, ZoneOffset.UTC));
        return Fn.create(() -> new Cookie(TokenType.BEARER.getValue(), tokenValue), cookie -> {
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setAttribute("SameSite", "Strict");
            cookie.setAttribute("Expires", expires);
        });
    }

    // TODO DEV Most likely, roles should not be here. Need to understand how this is going to be implemented with OAuth.
    public Jwt newToken(String providerId, String userId, List<String> roles) {
        Instant now = clock.instant();
        // Note on refresh tokens. Spring documentation doesn't provide any detailed
        // information how to configure refresh tokens to work and when this code was
        // written we were unable to test due to missing refresh token from Azure.
        // Inspecting the code, however, reveals that when JWT bearer is used, we should
        // provide some way to match it with refresh token stored in the depth of spring-security.
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(userId)
                .issuer(providerId)
                .issuedAt(now)
                .expiresAt(now.plus(expiry))
                .claim("scope", String.join(" ", roles))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims));
    }
}

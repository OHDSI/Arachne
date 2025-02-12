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
package com.odysseusinc.arachne.datanode.auth.oidc;

import com.google.common.net.HttpHeaders;
import com.odysseusinc.arachne.datanode.auth.JwtTokens;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
public class OidcSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    @Autowired
    private JwtTokens tokens;

    @Autowired
    private OidcCredentialsService credentialsService;

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication
    ) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            Object oauthPrincipal = oauthToken.getPrincipal();
            if (oauthPrincipal instanceof OidcUser principal) {
                String provider = oauthToken.getAuthorizedClientRegistrationId();
                Optional.ofNullable(
                        credentialsService.onLoginSuccess(provider, principal)
                ).ifPresent(uc ->
                        response.addCookie(tokens.cookie(provider, String.valueOf(uc.getUser().getId()), List.of()))
                );
                super.onAuthenticationSuccess(request, response, authentication);
            } else {
                log.warn("Unsupported authentication principal [{}]", oauthPrincipal.getClass());
                fail(response, "error");
            }

        } else {
            fail(response, "error");
            log.warn("Unsupported authentication type [{}]", authentication.getClass());
        }
    }


    private static void fail(HttpServletResponse response, String type) throws IOException {
        response.sendRedirect("/login?event=" + type);
    }

}

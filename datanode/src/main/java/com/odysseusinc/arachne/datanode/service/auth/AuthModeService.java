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
package com.odysseusinc.arachne.datanode.service.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthModeService {

    public static final String MODE_LOCAL = "LOCAL";
    public static final String MODE_OIDC = "OIDC";

    @Autowired(required = false)
    private OAuth2ClientProperties oAuth2ClientProperties;

    public String getAuthMode() {
        if (oAuth2ClientProperties != null
                && oAuth2ClientProperties.getRegistration() != null
                && !oAuth2ClientProperties.getRegistration().isEmpty()) {
            return MODE_OIDC;
        }
        return MODE_LOCAL;
    }

    public boolean isOidcMode() {
        return MODE_OIDC.equals(getAuthMode());
    }

    public boolean isLocalMode() {
        return MODE_LOCAL.equals(getAuthMode());
    }
}

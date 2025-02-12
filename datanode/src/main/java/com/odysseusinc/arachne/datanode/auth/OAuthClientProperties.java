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

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "spring.security.oauth2.client")
public class OAuthClientProperties {

    @Getter
    private final Map<String, Provider> provider = new HashMap<>();

    @Getter
    @Setter
    public static class Provider {
        private String text;
        private String image;
        private Rules rules = new Rules();
    }

    @Getter
    @Setter
    public static class Rules {
        /**
         * SpEL criteria to allow creating and updating users.
         * If this is not met, no further processing occurs and user is denied access with HTTP 403.
         * Root object is {@link org.springframework.security.oauth2.core.oidc.user.OidcUser}
         */
        private String allow;
        /**
         * List of fields to match on existing users. Key is field reference, value is SpEL.
         * SpEL root object is {@link org.springframework.security.oauth2.core.oidc.user.OidcUser}
         * @see com.odysseusinc.prometheus.auth.oidc.OidcCredentialsService#FIELDS
         */
        private Map<String, String> match;
        /**
         * false = user info is only filled once on creation
         * true =  user info is updated on each login
         */
        private boolean onLoginUpdateUserinfo;
    }

}

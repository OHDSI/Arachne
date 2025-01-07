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

import com.odysseusinc.arachne.datanode.jpa.JpaConditional;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import jakarta.servlet.http.Cookie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CredentialsService {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private JwtTokens tokens;

    public Optional<CredentialsEntity> login(String provider, CredentialsEntity credentials) {
        return Optional.ofNullable(credentials).map(uc -> {
            Instant terminated = uc.getTerminated();
            if (terminated == null) {
                log.info("User [{}] successfully logged in via [{}]", uc.getUser().getId(), provider);
                return uc;
            } else {
                log.info("User [{}] has login [{}] terminated on [{}]", uc.getUser().getId(), uc.getId(), terminated);
                return null;
            }
        });
    }

    public Cookie logout() {
        return tokens.cookieLogout();
    }

    public Optional<CredentialsEntity> find(JpaConditional<CredentialsEntity> conditional) {
        return JpaSugar.select(em, CredentialsEntity.class, (cb, query) -> root ->
                query.where(
                        JpaConditional.isNull(CredentialsEntity_.terminated).apply(cb, root),
                        conditional.apply(cb, root)
                ).orderBy(
                        cb.asc(root.get(CredentialsEntity_.timestamp))
                )
        ).getResultStream().findFirst();
    }

}

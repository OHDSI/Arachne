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

import com.fasterxml.jackson.core.type.TypeReference;
import com.odysseusinc.arachne.datanode.auth.CredentialsEntity;
import com.odysseusinc.arachne.datanode.auth.CredentialsEntity_;
import com.odysseusinc.arachne.datanode.auth.OAuthClientProperties;
import com.odysseusinc.arachne.datanode.auth.OAuthClientProperties.Rules;
import com.odysseusinc.arachne.datanode.auth.CredentialsService;
import com.odysseusinc.arachne.datanode.environment.SerializationUtils;
import com.odysseusinc.arachne.datanode.jpa.JpaConditional;
import com.odysseusinc.arachne.datanode.jpa.JpaPath;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.model.user.User_;
import com.odysseusinc.arachne.datanode.util.Fn;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import static com.odysseusinc.arachne.datanode.jpa.JpaConditional.has;

@Service
@Slf4j
public class OidcCredentialsService {

    public final static Map<String, JpaPath<User, String>> FIELDS = Map.of(
            "email", JpaPath.of(User_.email),
            "login", JpaPath.of(User_.username),
            "firstName", JpaPath.of(User_.firstName),
            "lastName", JpaPath.of(User_.lastName)
    );

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private OAuthClientProperties oauthProperties;
    @Autowired
    private CredentialsService credentialsService;

    @Transactional
    public CredentialsEntity onLoginSuccess(String provider, OidcUser oidcUser) {
        ExpressionParser parser = new SpelExpressionParser();
        StandardEvaluationContext context = new StandardEvaluationContext(oidcUser);

        Optional<Rules> rules = getRules(provider);
        String subject = oidcUser.getSubject();

        return find(provider, subject).flatMap(foundCred ->
                updateIfDiffers(provider, oidcUser, foundCred, parser, context, rules)
        ).orElseGet(() -> {
            if (allowAuto(parser, context, rules)) {
                String login = Optional.ofNullable(oidcUser.getPreferredUsername()).orElseGet(oidcUser::getEmail);
                if (login != null) {
                    User user = findMatchingUser(parser, context, rules.map(Rules::getMatch)).orElseGet(() ->
                            createUser(oidcUser, login)
                    );
                    return create(provider, user, subject, oidcUser);
                }
            }
            return null;
        });

    }

    private Optional<CredentialsEntity> updateIfDiffers(String provider, OidcUser oidcUser, CredentialsEntity foundCred, ExpressionParser parser, StandardEvaluationContext context, Optional<Rules> rules) {
        return findMatchingUser(parser, context, rules.map(Rules::getMatch)).flatMap(foundUser -> {
            if (!equals(foundCred, oidcUser)) {
                create(foundCred.getProvider(), foundUser, foundCred.getSubject(), oidcUser);
            }
            return credentialsService.login(provider, foundCred);
        });
    }

    private Boolean allowAuto(ExpressionParser parser, StandardEvaluationContext context, Optional<Rules> rules) {
        return rules.map(Rules::getAllow).map(expression ->
                parser.parseExpression(expression).getValue(context, Boolean.class)
        ).orElse(false);
    }

    private CredentialsEntity create(String provider, User user, String subject, OidcUser oidcUser) {
        CredentialsEntity created = Fn.create(CredentialsEntity::new, entity -> {
            entity.setId(UUID.randomUUID());
            entity.setType(CredentialsEntity.Type.OIDC);
            entity.setProvider(provider);
            entity.setSubject(subject);
            entity.setUser(user);
            entity.setData(SerializationUtils.serialize(oidcUser));
        });
        em.persist(created);
        return created;
    }

    private User createUser(OidcUser oidcUser, String login) {
        User user = Fn.create(User::new, u -> {
            u.setEmail(oidcUser.getEmail());
            u.setFirstName(oidcUser.getGivenName());
            u.setLastName(oidcUser.getFamilyName());
            u.setUsername(login);
        });
        em.persist(user);
        return user;
    }

    private boolean equals(CredentialsEntity credentials, OidcUser user) {
        // DefaultOidcUser lacks a default constructor, writing a custom deserializer unnecessary for such a simple use case.
        // The easiest approach is to deserialize it into a Map.
        Map<String, Object> storedUser  = SerializationUtils.deserialize(new TypeReference<Map<String, Object>>() {}).apply(credentials.getData());
        return Objects.equals(storedUser.get("email"), user.getEmail())
                && storedUser.get("emailVerified") == user.getEmailVerified()
                && Objects.equals(storedUser.get("preferredUsername"), user.getPreferredUsername())
                && Objects.equals(storedUser.get("givenName"), user.getGivenName())
                && Objects.equals(storedUser.get("familyName"), user.getFamilyName());
    }

    private Optional<Rules> getRules(String provider) {
        return Optional.ofNullable(
                oauthProperties.getProvider().get(provider)
        ).map(OAuthClientProperties.Provider::getRules);
    }

    private Optional<User> findMatchingUser(ExpressionParser parser, StandardEvaluationContext context, Optional<Map<String, String>> stringStringMap) {
        Stream<JpaConditional<User>> conditions = stringStringMap.stream().flatMap(match ->
                match.entrySet().stream().map(entry -> {
                    String value = parser.parseExpression(entry.getValue()).getValue(context, String.class);
                    return FIELDS.get(entry.getKey()).equal(value);
                })
        );
        return JpaSugar.select(em, User.class, (cb, query) -> root ->
                query.where(
                        conditions.map(
                                condition1 -> condition1.apply(cb, root)
                        ).reduce(cb::and).orElseGet(cb::disjunction)  // disjunction !
                )
        ).getResultStream().findFirst();
    }

    private Optional<CredentialsEntity> find(String provider, String subject) {
        return credentialsService.find(JpaConditional.conjunction(
                has(CredentialsEntity_.provider, provider),
                has(CredentialsEntity_.subject, subject),
                has(CredentialsEntity_.type, CredentialsEntity.Type.OIDC)
        ));
    }
}

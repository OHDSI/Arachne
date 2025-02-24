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
package com.odysseusinc.arachne.datanode.auth.basic;

import com.odysseusinc.arachne.datanode.auth.AuthorizationException;
import com.odysseusinc.arachne.datanode.auth.CredentialsEntity;
import com.odysseusinc.arachne.datanode.auth.CredentialsEntity_;
import com.odysseusinc.arachne.datanode.auth.CredentialsService;
import com.odysseusinc.arachne.datanode.auth.JwtTokens;
import com.odysseusinc.arachne.datanode.service.user.UserService;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.jpa.JpaConditional;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.model.user.User_;
import com.odysseusinc.arachne.datanode.util.Fn;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.Cookie;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class DbBasicCredentialsService {
    /**
     * Current password encoders (such as Argon2 used here) built-in salt implementation
     * that is later stored with the encoded password. Thus, there is no need to bother about
     * salt at all. Note that this also means thre is no way to get the same result if we encode
     * same password twice, so encoder's matches() method has to be used.
     */
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @PersistenceContext
    private EntityManager em;

    @Autowired
    private Clock clock;

    @Autowired
    private UserService userService;
    @Autowired
    private CredentialsService credentialsService;
    @Autowired
    private JwtTokens tokens;

    @Transactional
    public Pair<UserDTO, Cookie> login(String login, String password) {
        CredentialsEntity uc = find(login).flatMap(credentials -> {
            if (passwordEncoder.matches(password, credentials.getData())) {
                return credentialsService.login("basic", credentials);
            } else {
                log.info("Authorization failed for [{}]: Password mismatch", login);
                return Optional.empty();
            }
        }).orElseThrow(() ->
                new AuthorizationException("Login and password combination is not valid")
        );
        User user = uc.getUser();
        return Pair.of(userService.toDto(user), tokens.cookie("basic", String.valueOf(user.getId()), getRoles(user)));
    }

    @Transactional
    public void ensureRegistered(String login, String password, UserDTO info) {
        find(login).map(credentials ->
                updateIfPassDiffers(login, password, credentials)
        ).orElseGet(() -> {
                    User user = findUser(login).orElseGet(() ->
                            createUser(info, login)
                    );
                    return create(password, user);
                }
        );
    }

    private CredentialsEntity updateIfPassDiffers(String login, String password, CredentialsEntity credentials) {
        if (!passwordEncoder.matches(password, credentials.getData())) {
            log.info("On service account [{}], force updated password due to mismatch", login);
            credentials.setTerminated(Instant.now(clock));
            return create(password, credentials.getUser());
        }
        return credentials;
    }

    private CredentialsEntity create(String password, User user) {
        CredentialsEntity credentials = Fn.create(CredentialsEntity::new, entity -> {
            entity.setId(UUID.randomUUID());
            entity.setUser(user);
            entity.setTimestamp(clock.instant());
            entity.setType(CredentialsEntity.Type.BASIC);
            entity.setData(password);
        });
        em.persist(credentials);
        return credentials;
    }

    private User createUser(UserDTO info, String login) {
        log.info("Created user [{}]: {} {}, {}", login, info.getEmail(), info.getFirstname(), info.getLastname());
        User user = userService.createEntity(entity -> {
            entity.setEmail(info.getEmail());
            entity.setFirstName(info.getFirstname());
            entity.setLastName(info.getLastname());
            entity.setUsername(info.getUsername());
            entity.setRoles(userService.getRoles(info.getRoles()));
        });
        em.persist(user);
        return user;
    }

    private static List<String> getRoles(User user) {
        return Fn.stream(user.getRoles()).map(role ->
                role.getName().replace("ROLE_", "")
        ).toList();
    }

    private Optional<User> findUser(String login) {
        return JpaSugar.select(em, User.class).where(
                JpaConditional.has(User_.username, login)
        ).getResultStream().findFirst();
    }

    private Optional<CredentialsEntity> find(String login) {
        return credentialsService.find(JpaConditional.conjunction(
                JpaConditional.has(CredentialsEntity_.user, User_.username, login),
                JpaConditional.has(CredentialsEntity_.type, CredentialsEntity.Type.BASIC)
        ));
    }

}

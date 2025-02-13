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
package com.odysseusinc.arachne.datanode.service.user;

import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.jpa.JpaConditional;
import com.odysseusinc.arachne.datanode.jpa.JpaSugar;
import com.odysseusinc.arachne.datanode.model.user.Role;
import com.odysseusinc.arachne.datanode.model.user.Role_;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.model.user.User_;
import com.odysseusinc.arachne.datanode.util.Fn;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.ohdsi.authenticator.exception.AuthenticationException;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserService {

    @PersistenceContext
    private EntityManager em;


    @Transactional
    public User getUser(Principal principal) {
        return getUserMaybe(principal).orElseThrow(() -> new AuthenticationException("User is not authenticated"));
    }

    @Transactional
    public Optional<User> getUserMaybe(Long id) {
        return JpaSugar.select(em, User.class).where(
                JpaConditional.has(User_.id, id),
                enabled()
        ).getResultStream().findFirst();
    }

    @Transactional
    public Optional<User> getUserMaybe(Principal principal) throws PermissionDeniedException {
        if (principal instanceof JwtAuthenticationToken token) {
            return getUserMaybe(Long.valueOf(token.getToken().getSubject()));
        }
        return Optional.empty();
    }

    @Transactional
    public List<Role> getRoles(List<String> list) {
        return JpaSugar.select(em, Role.class).where(
                JpaConditional.in(Role_.name, list)
        ).getResultList();
    }

    @Transactional
    public User createEntity(Consumer<User> initializer) {
        return Fn.create(User::new, entity -> {
            initializer.accept(entity);
            em.persist(entity);
        });
    }

    public UserDTO toDto(User entity) {
        return Fn.create(UserDTO::new, dto -> {
            dto.setId(entity.getId());
            dto.setUsername(entity.getUsername());
            dto.setEmail(entity.getEmail());
            dto.setFirstname(entity.getFirstName());
            dto.setLastname(entity.getLastName());
            dto.setRoles(entity.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
            dto.setEnabled(entity.getEnabled());
        });
    }

    public Consumer<User> update(UserDTO dto) {
        return entity -> {
            entity.setUsername(dto.getUsername());
            entity.setEmail(dto.getEmail());
            entity.setFirstName(dto.getFirstname());
            entity.setLastName(dto.getLastname());
        };
    }

    private static JpaConditional<User> enabled() {
        return JpaConditional.disjunction(
                JpaConditional.isNull(User_.enabled),
                JpaConditional.has(User_.enabled, true)
        );
    }

}

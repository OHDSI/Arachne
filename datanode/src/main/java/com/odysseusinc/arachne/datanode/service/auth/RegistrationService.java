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

import com.odysseusinc.arachne.datanode.auth.CredentialsEntity;
import com.odysseusinc.arachne.datanode.auth.JwtTokens;
import com.odysseusinc.arachne.datanode.dto.auth.RegistrationRequest;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.model.user.Role;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.repository.UserRepository;
import com.odysseusinc.arachne.datanode.service.user.UserService;
import com.odysseusinc.arachne.datanode.util.Fn;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.Cookie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RegistrationService {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokens tokens;

    @Autowired
    private Clock clock;

    @Transactional
    public Map.Entry<UserDTO, Cookie> register(RegistrationRequest request) {
        if (userRepository.findOneByUsernameIgnoreCase(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        List<Role> roles = userService.getRoles(List.of("ROLE_USER"));
        User user = userService.createEntity(entity -> {
            entity.setUsername(request.getUsername());
            entity.setEnabled(true);
            entity.setRoles(roles);
        });
        em.persist(user);

        CredentialsEntity credentials = Fn.create(CredentialsEntity::new, entity -> {
            entity.setId(UUID.randomUUID());
            entity.setUser(user);
            entity.setTimestamp(clock.instant());
            entity.setType(CredentialsEntity.Type.BASIC);
            entity.setData(passwordEncoder.encode(request.getPassword()));
        });
        em.persist(credentials);

        log.info("Registered new user [{}]", request.getUsername());

        List<String> roleNames = roles.stream()
                .map(r -> r.getName().replace("ROLE_", ""))
                .collect(Collectors.toList());
        Cookie cookie = tokens.cookie("basic", String.valueOf(user.getId()), roleNames);

        return Map.entry(userService.toDto(user), cookie);
    }
}

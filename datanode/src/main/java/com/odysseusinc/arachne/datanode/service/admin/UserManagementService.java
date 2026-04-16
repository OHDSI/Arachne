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
package com.odysseusinc.arachne.datanode.service.admin;

import com.odysseusinc.arachne.datanode.auth.CredentialsEntity;
import com.odysseusinc.arachne.datanode.dto.auth.CreateUserRequest;
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
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserManagementService {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private Clock clock;

    @Transactional(readOnly = true)
    public List<UserDTO> listUsers() {
        return userRepository.findAll(Sort.by("id")).stream()
                .map(userService::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDTO getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        return userService.toDto(user);
    }

    @Transactional
    public UserDTO updateRoles(Long userId, List<String> roleNames, Long currentUserId) {
        if (userId.equals(currentUserId)) {
            boolean removingOwnAdmin = !roleNames.contains("ROLE_ADMIN");
            if (removingOwnAdmin) {
                throw new IllegalArgumentException("Cannot remove your own admin role");
            }
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        List<Role> roles = userService.getRoles(roleNames);
        user.setRoles(roles);
        em.merge(user);
        log.info("Updated roles for user [{}] to {}", user.getUsername(), roleNames);
        return userService.toDto(user);
    }

    @Transactional
    public UserDTO enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setEnabled(true);
        em.merge(user);
        log.info("Enabled user [{}]", user.getUsername());
        return userService.toDto(user);
    }

    @Transactional
    public UserDTO disableUser(Long userId, Long currentUserId) {
        if (userId.equals(currentUserId)) {
            throw new IllegalArgumentException("Cannot disable your own account");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setEnabled(false);
        em.merge(user);
        log.info("Disabled user [{}]", user.getUsername());
        return userService.toDto(user);
    }

    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.findOneByUsernameIgnoreCase(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + request.getUsername());
        }
        List<String> roleNames = request.getRoles();
        if (roleNames == null || roleNames.isEmpty()) {
            roleNames = List.of("ROLE_USER");
        }
        List<Role> roles = userService.getRoles(roleNames);
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

        log.info("Admin created user [{}] with roles {}", request.getUsername(), roleNames);
        return userService.toDto(user);
    }

    @Transactional
    public void deleteUser(Long userId, Long currentUserId) {
        if (userId.equals(currentUserId)) {
            throw new IllegalArgumentException("Cannot delete your own account");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setEnabled(false);
        em.merge(user);
        log.info("Soft-deleted (disabled) user [{}]", user.getUsername());
    }
}

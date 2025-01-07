/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.service.impl;

import com.odysseusinc.arachne.commons.utils.UserIdUtils;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.user.Role;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.repository.RoleRepository;
import com.odysseusinc.arachne.datanode.repository.UserRepository;
import com.odysseusinc.arachne.datanode.service.events.user.UserDeletedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.odysseusinc.arachne.datanode.security.RolesConstants.ROLE_ADMIN;

@Service
@Transactional
/**
 * @deprecated This class is going to be removed. All necessary logic has been moved to UserService.
 */
public class LegacyUserService {
    private static final Logger LOG = LoggerFactory.getLogger(LegacyUserService.class);
    private static final String USER_NOT_FOUND_EXCEPTION = "User with id='$s' is not found";
    private static final String ROLE_ADMIN_IS_NOT_FOUND_EXCEPTION = "ROLE_ADMIN is not found";
    private static final String REMOVING_USER_LOG = "Removing user with id='{}'";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public User create(User user) {
        user.setEnabled(true);
        user.getRoles().add(getAdminRole());
        return userRepository.save(user);
    }

    public User get(Long id) throws NotExistException {
        final User user = userRepository.getOne(id);
        if (user == null) {
            final String message = String.format(USER_NOT_FOUND_EXCEPTION, id);
            throw new NotExistException(message, User.class);
        }
        return user;
    }

    
    public Optional<User> findByUsername(String login) {
        return userRepository.findOneByUsernameIgnoreCase(login);
    }

    
    public void disableUser(String login) {
        toggleUser(login, false);
    }

    public void enableUser(String login) {
        toggleUser(login, true);
    }

    protected void toggleUser(String login, Boolean enabled) {
        User user = userRepository.findOneByUsernameIgnoreCase(login).orElseThrow(IllegalArgumentException::new);
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    
    public void deleteUser(String login) {

        userRepository.findOneByUsernameIgnoreCase(login).ifPresent(u -> {
            userRepository.delete(u);
            LOG.debug("Deleted User: {}", u);
        });
    }

    private Role getAdminRole() {

        return roleRepository.findFirstByName(ROLE_ADMIN)
                .orElseThrow(() -> new NotExistException(ROLE_ADMIN_IS_NOT_FOUND_EXCEPTION, Role.class));
    }

    @Transactional
    public void remove(Long id) throws NotExistException {

        LOG.info(REMOVING_USER_LOG, id);
        final User user = get(id);
        userRepository.deleteById(id);

        eventPublisher.publishEvent(new UserDeletedEvent(this, user));
    }
    
    public User getUser(Principal principal) throws PermissionDeniedException {

        if (principal == null) {
            throw new PermissionDeniedException();
        }
        return findByUsername(principal.getName()).orElseThrow(PermissionDeniedException::new);
    }
    
    public List<User> suggestNotAdmin(User user, final String query, Integer limit) {
        return Collections.emptyList();
    }

    public List<User> getAllAdmins(final String sortBy, final Boolean sortAsc) {
        final Sort.Direction direction = sortAsc != null && sortAsc ? Sort.Direction.ASC : Sort.Direction.DESC;
        final Sort sort;
        if (sortBy == null || sortBy.isEmpty() || sortBy.equals("name")) {
            sort = Sort.by(direction, "firstName", "lastName");
        } else {
            sort = Sort.by(direction, sortBy);
        }
        return userRepository.findAll(sort);
    }
    
    public static UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(UserIdUtils.idToUuid(user.getId()));
        dto.setFirstname(user.getFirstName());
        dto.setLastname(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        }
        dto.setEnabled(Objects.nonNull(user.getEnabled()) ? user.getEnabled() : false);
        return dto;
    }
}

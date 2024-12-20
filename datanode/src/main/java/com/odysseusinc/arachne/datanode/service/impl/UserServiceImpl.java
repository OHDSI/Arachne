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

import com.odysseusinc.arachne.datanode.exception.AlreadyExistsException;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.user.Role;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.repository.RoleRepository;
import com.odysseusinc.arachne.datanode.repository.UserRepository;
import com.odysseusinc.arachne.datanode.service.UserService;
import com.odysseusinc.arachne.datanode.service.events.user.UserDeletedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.odysseusinc.arachne.datanode.security.RolesConstants.ROLE_ADMIN;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserServiceImpl.class);
    private static final String USER_NOT_FOUND_EXCEPTION = "User with id='$s' is not found";
    private static final String ROLE_ADMIN_IS_NOT_FOUND_EXCEPTION = "ROLE_ADMIN is not found";
    private static final String REMOVING_USER_LOG = "Removing user with id='{}'";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public User create(User user) {

        user.setEnabled(true);
        user.getRoles().add(getAdminRole());
        return userRepository.save(user);
    }

    @Override
    public User get(Long id) throws NotExistException {

        final User user = userRepository.getOne(id);
        if (user == null) {
            final String message = String.format(USER_NOT_FOUND_EXCEPTION, id);
            throw new NotExistException(message, User.class);
        }
        return user;
    }

    @Override
    public Optional<User> findByUsername(String login) {

        return userRepository.findOneByUsernameIgnoreCase(login);
    }

    @Override
    public void disableUser(String login) {

        toggleUser(login, false);
    }

    @Override
    public void enableUser(String login) {

        toggleUser(login, true);
    }

    protected void toggleUser(String login, Boolean enabled) {
        User user = userRepository.findOneByUsernameIgnoreCase(login).orElseThrow(IllegalArgumentException::new);
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Override
    public void deleteUser(String login) {

        userRepository.findOneByUsernameIgnoreCase(login).ifPresent(u -> {
            userRepository.delete(u);
            LOG.debug("Deleted User: {}", u);
        });
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        return userRepository
                .findOneByUsernameIgnoreCaseAndEnabled(username, true)
                .map(user ->
                        new org.springframework.security.core.userdetails.User(
                                user.getUsername(), "",
                                user.getRoles().stream()
                                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                                        .collect(Collectors.toList())
                        ))
                .orElseThrow(() -> new AuthException(String.format("The %s user is not found.", username)));
    }

    @Transactional
    @Override
    public User createIfFirst(User centralUser) throws AlreadyExistsException {

        long count = userRepository.count();
        if (count == 0) {
            User user = new User();
            user.setId(centralUser.getId());
            user.setEmail(centralUser.getEmail());
            user.setUsername(centralUser.getUsername());
            user.setFirstName(centralUser.getFirstName());
            user.setLastName(centralUser.getLastName());
            return create(user);
        }
        else {
            throw new AlreadyExistsException("user not registered");
        }
    }

    @Override
    public User updateUserInfo(User centralUserDto) {

        User user = findByUsername(centralUserDto.getUsername())
                .orElseThrow(() -> new NotExistException(String.format("Cannot find user '%s' to update info", centralUserDto.getUsername()), User.class));
        user.setFirstName(centralUserDto.getFirstName());
        user.setLastName(centralUserDto.getLastName());
        return userRepository.save(user);
    }

    private Role getAdminRole() {

        return roleRepository.findFirstByName(ROLE_ADMIN)
                .orElseThrow(() -> new NotExistException(ROLE_ADMIN_IS_NOT_FOUND_EXCEPTION, Role.class));
    }

    @Override
    @Transactional
    public void remove(Long id) throws NotExistException {

        LOG.info(REMOVING_USER_LOG, id);
        final User user = get(id);
        userRepository.deleteById(id);

        eventPublisher.publishEvent(new UserDeletedEvent(this, user));
    }

    @Override
    public User getUser(Principal principal) throws PermissionDeniedException {

        if (principal == null) {
            throw new PermissionDeniedException();
        }
        return findByUsername(principal.getName()).orElseThrow(PermissionDeniedException::new);
    }

    @Override
    public List<User> suggestNotAdmin(User user, final String query, Integer limit) {
        return Collections.emptyList();
    }

    @Override
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

    @Override
    public List<User> findStandaloneUsers() {

        return userRepository.findBySyncAndEnabledIsTrue(false);
    }
}

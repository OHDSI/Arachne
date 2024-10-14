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

package com.odysseusinc.arachne.datanode.service;

import com.odysseusinc.arachne.commons.utils.UserIdUtils;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.exception.AlreadyExistsException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.user.Role;
import com.odysseusinc.arachne.datanode.model.user.User;
import org.ohdsi.authenticator.model.UserInfo;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

public interface UserService extends UserDetailsService {

    static UserDTO toDto(User user) {
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

    static User toEntity(UserInfo source) {
        org.ohdsi.authenticator.model.User authUser = source.getUser();
        User user = new User();

        user.setUsername(source.getUsername());
        user.setEmail(authUser.getEmail());
        user.setFirstName(authUser.getFirstName());
        user.setLastName(authUser.getLastName());
        return user;
    }

    User get(Long id) throws NotExistException;

    Optional<User> findByUsername(String login);

    void disableUser(String login);

    void enableUser(String login);

    void deleteUser(String login);

    User createIfFirst(User centralUserDto) throws AlreadyExistsException;

    User updateUserInfo(User centralUserDto);

    List<User> suggestNotAdmin(User user, String query, Integer limit);

    List<User> getAllAdmins(String sortBy, Boolean sortAsc);

    void remove(Long id) throws NotExistException;

    User getUser(Principal principal) throws PermissionDeniedException;

    User create(User user);

    List<User> findStandaloneUsers();
}

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

import com.odysseusinc.arachne.datanode.exception.AlreadyExistsException;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.user.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {

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

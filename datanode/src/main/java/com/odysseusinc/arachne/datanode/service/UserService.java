/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: October 31, 2016
 *
 */

package com.odysseusinc.arachne.datanode.service;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonUserDTO;
import com.odysseusinc.arachne.datanode.exception.NotExistException;
import com.odysseusinc.arachne.datanode.exception.PermissionDeniedException;
import com.odysseusinc.arachne.datanode.model.user.User;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    User createUserInformation(String login, String password, String firstName, String lastName, String email,
                               String langKey);

    User get(Long id) throws NotExistException;

    Optional<User> findByUsername(String login);

    void disableUser(String login);

    void enableUser(String login);

    void deleteUser(String login);

    void setToken(User user, String token);

    User createIfFirst(String email);

    List<User> suggestNotAdmin(User user, String query, Integer limit);

    List<User> getAllAdmins(String sortBy, Boolean sortAsc);

    List<User> getAllUsers(String sortBy, Boolean sortAsc);

    void addUserToAdmins(User currentUser, Long id);

    void removeUserFromAdmins(Long id);

    void remove(Long id) throws NotExistException;

    List<CommonUserDTO> suggestUsersFromCentral(User user, String query, int i);

    User addUserFromCentral(User user, Long centralId);

    User getUser(Principal principal) throws PermissionDeniedException;
}
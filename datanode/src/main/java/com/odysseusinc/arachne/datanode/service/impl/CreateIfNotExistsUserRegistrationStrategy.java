/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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

import static com.odysseusinc.arachne.datanode.service.UserRegistrationStrategy.CREATE_IF_NOT_EXISTS;

import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.UserRegistrationStrategy;
import com.odysseusinc.arachne.datanode.service.UserService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(value = "authenticator.user.registrationStrategy", havingValue = CREATE_IF_NOT_EXISTS)
public class CreateIfNotExistsUserRegistrationStrategy implements UserRegistrationStrategy {

    private final UserService userService;

    public CreateIfNotExistsUserRegistrationStrategy(UserService userService) {

        this.userService = userService;
    }

    @Override
    public User registerUser(User user) {

        return userService.findByUsername(user.getUsername()).orElseGet(() -> userService.create(user));
    }
}

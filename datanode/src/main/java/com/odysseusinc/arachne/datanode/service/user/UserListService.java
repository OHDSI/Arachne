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

import com.google.common.collect.ImmutableMap;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.filtering.JpaListService;
import com.odysseusinc.arachne.datanode.jpa.JpaPath;
import com.odysseusinc.arachne.datanode.jpa.JpaQueryExpression;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.model.user.User_;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserListService extends JpaListService<User, UserDTO> {

    @Autowired
    private UserService userService;

    private static Map<String, JpaQueryExpression<User, ?>> sorts() {
        return ImmutableMap.<String, JpaQueryExpression<User, ?>>builder()
                .put("id", JpaPath.of(User_.id))
                .put("name", JpaPath.of(User_.firstName))
                .put("email", JpaPath.of(User_.email))
                .put("username", JpaPath.of(User_.username))
                .build();
    }

    public UserListService() {
        super(
                sorts().entrySet().stream().map(entry -> entry)
        );
    }

    @Override
    protected Function<User, UserDTO> toDto(List<User> entities) {
        return userService::toDto;
    }
}

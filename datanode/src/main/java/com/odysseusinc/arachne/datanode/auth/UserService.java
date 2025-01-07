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
package com.odysseusinc.arachne.datanode.auth;

import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.util.Fn;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserService {

    @PersistenceContext
    private EntityManager em;

    public User createEntity(Consumer<User> initializer) {
        return Fn.create(User::new, entity -> {
            initializer.accept(entity);
            create(entity);
        });
    }

    public void create(User entity) {
        em.persist(entity);
    }

    public UserDTO toDto(User entity) {
        return Fn.create(UserDTO::new, dto -> {
            dto.setEmail(entity.getEmail());
            dto.setFirstname(entity.getFirstName());
            dto.setLastname(entity.getLastName());
        });
    }

}

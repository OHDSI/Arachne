/*
 * Copyright 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.security;

import com.odysseusinc.arachne.datanode.auth.basic.DbBasicCredentialsService;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.model.user.Role;
import com.odysseusinc.arachne.datanode.util.Fn;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * At startup, ensures user accounts from configuration are created in the database.
 * This is only useful if application database doubles for Authenticator in DB mode,
 * as there is no application code to work with the persisted password directly.
 */
@Slf4j
@Service
@ConfigurationProperties(prefix = "datanode")
public class UserAccountInitializer {
    @Autowired
    private DbBasicCredentialsService credentialsService;

    @Getter
    @Setter
    private Map<String, Account> users;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {
        if (users != null) {
            log.info("Verifying {} service accounts", users.size());
            users.forEach((name, account) -> {
                UserDTO user = Fn.create(UserDTO::new, dto -> {
                    dto.setUsername(name);
                    dto.setEmail(account.getEmail());
                    dto.setFirstname(account.getFirstName());
                    dto.setLastname(account.getLastName());
                    dto.setRoles(Optional.ofNullable(account.getRoles()).orElse(List.of()));

                });
                log.info("Creating [{}]: {} {} {}", name, user.getFirstname(), user.getLastname(), user.getEmail());
                credentialsService.ensureRegistered(name, account.getPassword(), user);
            });
        }
    }

    @Getter
    @Setter
    public static class Account {
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String password;
        private List<String> roles;
    }

}

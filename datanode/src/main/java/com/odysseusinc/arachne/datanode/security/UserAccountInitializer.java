package com.odysseusinc.arachne.datanode.security;

import com.odysseusinc.arachne.datanode.model.user.User;
import com.odysseusinc.arachne.datanode.service.UserService;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private UserService userService;

    @Getter
    @Setter
    private Map<String, Account> users;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {
        if (users != null) {
            log.info("Verifying {} service accounts", users.size());
            users.forEach((name, account) -> {
                Optional<User> found = userService.findByUsername(name);
                if (!found.isPresent()) {
                    User user = new User();
                    user.setUsername(name);
                    user.setEmail(account.getEmail());
                    user.setFirstName(account.getFirstName());
                    user.setLastName(account.getLastName());
                    user.setPassword(account.getPassword());
                    log.info("Creating [{}]: {} {} {}", name, user.getFirstName(), user.getLastName(), user.getEmail());
                    userService.create(user);
                }
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
    }

}

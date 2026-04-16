/*
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
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
package com.odysseusinc.arachne.datanode.controller.admin;

import com.odysseusinc.arachne.datanode.dto.auth.AuthSettingsDTO;
import com.odysseusinc.arachne.datanode.dto.auth.CreateUserRequest;
import com.odysseusinc.arachne.datanode.dto.auth.UserRolesRequest;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.service.admin.UserManagementService;
import com.odysseusinc.arachne.datanode.service.auth.AuthSettingsService;
import com.odysseusinc.arachne.datanode.service.auth.PasswordPolicyService;
import com.odysseusinc.arachne.datanode.service.user.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthSettingsService authSettingsService;

    @Autowired
    private PasswordPolicyService passwordPolicyService;

    @GetMapping("/users")
    public List<UserDTO> listUsers() {
        return userManagementService.listUsers();
    }

    @GetMapping("/users/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        return userManagementService.getUser(id);
    }

    @PutMapping("/users/{id}/roles")
    public UserDTO updateRoles(@PathVariable Long id, @Valid @RequestBody UserRolesRequest request, Principal principal) {
        Long currentUserId = userService.getUser(principal).getId();
        return userManagementService.updateRoles(id, request.getRoles(), currentUserId);
    }

    @PutMapping("/users/{id}/enable")
    public UserDTO enableUser(@PathVariable Long id) {
        return userManagementService.enableUser(id);
    }

    @PutMapping("/users/{id}/disable")
    public UserDTO disableUser(@PathVariable Long id, Principal principal) {
        Long currentUserId = userService.getUser(principal).getId();
        return userManagementService.disableUser(id, currentUserId);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        List<String> errors = passwordPolicyService.validate(request.getPassword());
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }
        return ResponseEntity.ok(userManagementService.createUser(request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Principal principal) {
        Long currentUserId = userService.getUser(principal).getId();
        userManagementService.deleteUser(id, currentUserId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/auth-settings")
    public AuthSettingsDTO getAuthSettings() {
        return authSettingsService.getAuthSettings();
    }

    @PutMapping("/auth-settings")
    public AuthSettingsDTO updateAuthSettings(@RequestBody AuthSettingsDTO settings) {
        authSettingsService.updateAuthSettings(settings);
        return authSettingsService.getAuthSettings();
    }
}

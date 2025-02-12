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

package com.odysseusinc.arachne.datanode.controller;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthenticationModeDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAuthenticationRequest;
import com.odysseusinc.arachne.datanode.auth.CredentialsService;
import com.odysseusinc.arachne.datanode.service.user.UserService;
import com.odysseusinc.arachne.datanode.auth.basic.DbBasicCredentialsService;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.dto.user.UserInfoDTO;
import com.odysseusinc.arachne.datanode.exception.AuthException;
import io.swagger.annotations.ApiOperation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class AuthController {
    protected Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private CredentialsService credentialsService;

    @Autowired
    private DbBasicCredentialsService basicCredentialsService;

    @ApiOperation(value = "Sign in user. Returns JWT token.")
    @RequestMapping(value = "${api.loginEnteryPoint}", method = RequestMethod.POST)
    public ResponseEntity<?> login(@Valid @RequestBody CommonAuthenticationRequest request, HttpServletResponse response) {
        return success(
                response,
                basicCredentialsService.login(request.getUsername(), request.getPassword())
        );
    }

    @ApiOperation("Logout")
    @RequestMapping(value = "/api/v1/auth/logout", method = RequestMethod.POST)
    public ResponseEntity<?> logout(HttpServletResponse response) {
        return success(response, credentialsService.logout());
    }


    @ApiOperation("Get current principal")
    @RequestMapping(value = "/api/v1/auth/me", method = GET)
    public UserInfoDTO principal(Principal principal) {
        Long userId = Long.valueOf(principal.getName());

        String name = principal.getName();
        return userService.getById(userId)
                .map(user -> {
                    UserInfoDTO userInfoDTO = new UserInfoDTO();
                    userInfoDTO.setUsername(user.getUsername());
                    final boolean isAdmin = user.getRoles().stream()
                            .anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
                    userInfoDTO.setIsAdmin(isAdmin);
                    userInfoDTO.setFirstname(user.getFirstName());
                    userInfoDTO.setLastname(user.getLastName());
                    return userInfoDTO;
                }).orElseThrow(() -> new AuthException("User not found: [" + name + "]"));
    }

    private static ResponseEntity<UserDTO> success(HttpServletResponse response, Map.Entry<UserDTO, Cookie> result) {
        response.addCookie(result.getValue());
        return ResponseEntity.ok().body(result.getKey());
    }

    private static ResponseEntity<UserDTO> success(HttpServletResponse response, Cookie cookie) {
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

}

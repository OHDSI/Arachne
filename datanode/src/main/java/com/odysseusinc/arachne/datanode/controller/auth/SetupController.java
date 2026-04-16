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
package com.odysseusinc.arachne.datanode.controller.auth;

import com.odysseusinc.arachne.datanode.dto.auth.SetupRequest;
import com.odysseusinc.arachne.datanode.dto.user.UserDTO;
import com.odysseusinc.arachne.datanode.service.auth.PasswordPolicyService;
import com.odysseusinc.arachne.datanode.service.auth.SetupService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class SetupController {

    @Autowired
    private SetupService setupService;

    @Autowired
    private PasswordPolicyService passwordPolicyService;

    @PostMapping("/setup")
    public ResponseEntity<?> setup(@Valid @RequestBody SetupRequest request, HttpServletResponse response) {
        if (setupService.isInitialized()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "System is already initialized"));
        }

        List<String> errors = passwordPolicyService.validate(request.getPassword());
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }

        Map.Entry<UserDTO, Cookie> result = setupService.setupFirstUser(request);
        response.addCookie(result.getValue());
        return ResponseEntity.ok(result.getKey());
    }
}

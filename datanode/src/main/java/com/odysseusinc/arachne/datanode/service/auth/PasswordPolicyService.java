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
package com.odysseusinc.arachne.datanode.service.auth;

import com.odysseusinc.arachne.datanode.dto.auth.PasswordPolicyDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PasswordPolicyService {

    @Autowired
    private AuthSettingsService authSettingsService;

    public List<String> validate(String password) {
        PasswordPolicyDTO policy = authSettingsService.getPasswordPolicy();
        List<String> errors = new ArrayList<>();

        if (password == null || password.length() < policy.getMinLength()) {
            errors.add("Password must be at least " + policy.getMinLength() + " characters");
        }
        if (policy.isRequireUppercase() && (password == null || !password.matches(".*[A-Z].*"))) {
            errors.add("Password must contain at least one uppercase letter");
        }
        if (policy.isRequireLowercase() && (password == null || !password.matches(".*[a-z].*"))) {
            errors.add("Password must contain at least one lowercase letter");
        }
        if (policy.isRequireDigit() && (password == null || !password.matches(".*\\d.*"))) {
            errors.add("Password must contain at least one digit");
        }
        if (policy.isRequireSpecialChar() && (password == null || !password.matches(".*[^a-zA-Z0-9].*"))) {
            errors.add("Password must contain at least one special character");
        }

        return errors;
    }
}

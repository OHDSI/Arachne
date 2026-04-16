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

import com.odysseusinc.arachne.datanode.dto.auth.AuthModeDTO;
import com.odysseusinc.arachne.datanode.dto.auth.PasswordPolicyDTO;
import com.odysseusinc.arachne.datanode.dto.auth.SetupStatusDTO;
import com.odysseusinc.arachne.datanode.service.auth.AuthModeService;
import com.odysseusinc.arachne.datanode.service.auth.AuthSettingsService;
import com.odysseusinc.arachne.datanode.service.auth.SetupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthModeController {

    @Autowired
    private AuthModeService authModeService;

    @Autowired
    private AuthSettingsService authSettingsService;

    @Autowired
    private SetupService setupService;

    @GetMapping("/mode")
    public AuthModeDTO getMode() {
        AuthModeDTO dto = new AuthModeDTO();
        dto.setMode(authModeService.getAuthMode());
        dto.setSelfRegistrationEnabled(authSettingsService.isSelfRegistrationEnabled());
        return dto;
    }

    @GetMapping("/setup-status")
    public SetupStatusDTO getSetupStatus() {
        SetupStatusDTO dto = new SetupStatusDTO();
        dto.setInitialized(setupService.isInitialized());
        return dto;
    }

    @GetMapping("/password-policy")
    public PasswordPolicyDTO getPasswordPolicy() {
        return authSettingsService.getPasswordPolicy();
    }
}

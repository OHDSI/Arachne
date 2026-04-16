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

import com.odysseusinc.arachne.datanode.dto.auth.AuthSettingsDTO;
import com.odysseusinc.arachne.datanode.dto.auth.PasswordPolicyDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AuthSettingsService {

    @PersistenceContext
    private EntityManager em;

    @Transactional(readOnly = true)
    public boolean isSelfRegistrationEnabled() {
        return "true".equals(getSetting("self_registration_enabled"));
    }

    @Transactional(readOnly = true)
    public PasswordPolicyDTO getPasswordPolicy() {
        Map<String, String> settings = getAllSettings();
        PasswordPolicyDTO dto = new PasswordPolicyDTO();
        dto.setMinLength(Integer.parseInt(settings.getOrDefault("password_min_length", "8")));
        dto.setRequireUppercase("true".equals(settings.get("password_require_uppercase")));
        dto.setRequireLowercase("true".equals(settings.get("password_require_lowercase")));
        dto.setRequireDigit("true".equals(settings.get("password_require_digit")));
        dto.setRequireSpecialChar("true".equals(settings.get("password_require_special_char")));
        return dto;
    }

    @Transactional(readOnly = true)
    public AuthSettingsDTO getAuthSettings() {
        AuthSettingsDTO dto = new AuthSettingsDTO();
        dto.setSelfRegistrationEnabled(isSelfRegistrationEnabled());
        dto.setPasswordPolicy(getPasswordPolicy());
        return dto;
    }

    @Transactional
    public void updateAuthSettings(AuthSettingsDTO settings) {
        setSetting("self_registration_enabled", String.valueOf(settings.isSelfRegistrationEnabled()));
        if (settings.getPasswordPolicy() != null) {
            PasswordPolicyDTO pp = settings.getPasswordPolicy();
            if (pp.getMinLength() < 8) {
                pp.setMinLength(8);
            }
            setSetting("password_min_length", String.valueOf(pp.getMinLength()));
            setSetting("password_require_uppercase", String.valueOf(pp.isRequireUppercase()));
            setSetting("password_require_lowercase", String.valueOf(pp.isRequireLowercase()));
            setSetting("password_require_digit", String.valueOf(pp.isRequireDigit()));
            setSetting("password_require_special_char", String.valueOf(pp.isRequireSpecialChar()));
        }
    }

    private String getSetting(String key) {
        @SuppressWarnings("unchecked")
        List<String> results = em.createNativeQuery("SELECT value FROM auth_settings WHERE key = :key")
                .setParameter("key", key)
                .getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

    private Map<String, String> getAllSettings() {
        @SuppressWarnings("unchecked")
        List<Object[]> results = em.createNativeQuery("SELECT key, value FROM auth_settings").getResultList();
        Map<String, String> map = new HashMap<>();
        for (Object[] row : results) {
            map.put((String) row[0], (String) row[1]);
        }
        return map;
    }

    private void setSetting(String key, String value) {
        em.createNativeQuery("INSERT INTO auth_settings (key, value) VALUES (:key, :value) ON CONFLICT (key) DO UPDATE SET value = :value")
                .setParameter("key", key)
                .setParameter("value", value)
                .executeUpdate();
    }
}

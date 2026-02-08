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

package com.odysseusinc.arachne.datanode.auth;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.Principal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoginDisabledAuthenticationTest {

    @Test
    void getName_returnsStableNameAndDoesNotStackOverflow() {
        LoginDisabledAuthentication auth = new LoginDisabledAuthentication(
                42L,
                List.of(new SimpleGrantedAuthority("SCOPE_ADMIN"))
        );
        assertEquals("login-disabled-42", auth.getName());
        // Critical: when principal is this, Principal.getName() must not recurse into token.getName()
        Principal principal = (Principal) auth.getPrincipal();
        assertEquals("login-disabled-42", principal.getName());
        // Repeated calls must not stack overflow (e.g. from logging/serialization)
        for (int i = 0; i < 1000; i++) {
            auth.getName();
            principal.getName();
        }
    }

    @Test
    void getPrincipal_returnsThisForUserServiceResolution() {
        LoginDisabledAuthentication auth = new LoginDisabledAuthentication(1L, List.of());
        Object principal = auth.getPrincipal();
        assertTrue(principal instanceof LoginDisabledAuthentication);
        assertEquals(auth, principal);
        assertEquals(1L, ((LoginDisabledAuthentication) principal).getUserId());
    }

    @Test
    void getCredentials_returnsNull() {
        LoginDisabledAuthentication auth = new LoginDisabledAuthentication(1L, List.of());
        assertNull(auth.getCredentials());
    }

    @Test
    void isAuthenticated_returnsTrue() {
        LoginDisabledAuthentication auth = new LoginDisabledAuthentication(1L, List.of());
        assertTrue(auth.isAuthenticated());
    }

    @Test
    void getUserId_returnsProvidedId() {
        LoginDisabledAuthentication auth = new LoginDisabledAuthentication(99L, List.of());
        assertEquals(99L, auth.getUserId());
    }

    @Test
    void getAuthorities_returnsProvidedAuthorities() {
        var authorities = List.of(
                new SimpleGrantedAuthority("SCOPE_ADMIN"),
                new SimpleGrantedAuthority("SCOPE_USER")
        );
        LoginDisabledAuthentication auth = new LoginDisabledAuthentication(1L, authorities);
        assertNotNull(auth.getAuthorities());
        assertEquals(2, auth.getAuthorities().size());
    }

    @Test
    void equals_andHashCode_doNotStackOverflow() {
        var authorities = List.of(new SimpleGrantedAuthority("SCOPE_ADMIN"));
        LoginDisabledAuthentication auth1 = new LoginDisabledAuthentication(1L, authorities);
        LoginDisabledAuthentication auth2 = new LoginDisabledAuthentication(1L, authorities);
        assertTrue(auth1.equals(auth2));
        assertEquals(auth1.hashCode(), auth2.hashCode());
        assertTrue(auth1.equals(auth1));
        assertFalse(auth1.equals(new LoginDisabledAuthentication(2L, authorities)));
    }
}

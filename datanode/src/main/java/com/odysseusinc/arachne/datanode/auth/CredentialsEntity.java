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

import com.odysseusinc.arachne.datanode.model.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@Entity
@Table(name = "credentials")
public class CredentialsEntity extends IdentifiableEntity {

    @Column
    private Instant timestamp;

    @Column
    private Instant terminated;

    @Enumerated(EnumType.STRING)
    @Column(name = "credential_type", nullable = false)
    private Type type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Provider id, as defined in spring-security configuration alias.
     * We deliverately don't link to issuer urls in DB so in case of change
     * admin will have freedom to either create new provider or link to an existing one.
     */
    @Column(name = "provider")
    private String provider;

    /**
     * Subject defines user identity in scope of a provider.
     */
    @Column(name = "subject")
    private String subject;

    @Column(name = "data", nullable = false)
    private String data;

    public enum Type {
        BASIC,
        OIDC
    }

}
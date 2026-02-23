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

package com.odysseusinc.arachne.datanode.model.study;

import com.odysseusinc.arachne.datanode.model.types.StudyEnvVarEncryptedConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Environment variable injected into study Docker containers at run time.
 * Value is stored encrypted. Accessible in codeToRun.R via Sys.getenv(name).
 */
@Getter
@Setter
@Entity
@Table(name = "study_environment_variables")
public class StudyEnvironmentVariable {

    @Id
    @SequenceGenerator(name = "study_env_vars_id_seq_generator", sequenceName = "study_environment_variables_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "study_env_vars_id_seq_generator")
    private Long id;

    @Column(name = "name", nullable = false, length = 512, unique = true)
    private String name;

    @Convert(converter = StudyEnvVarEncryptedConverter.class)
    @Column(name = "value", nullable = false, columnDefinition = "TEXT")
    private String value;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

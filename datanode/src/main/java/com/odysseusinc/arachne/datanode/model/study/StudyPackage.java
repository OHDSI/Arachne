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

package com.odysseusinc.arachne.datanode.model.study;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Installed study package from the Study Repository catalog (name + version).
 * Holds the user-editable run script saved with the study.
 */
@Getter
@Setter
@Entity
@Table(name = "study_packages")
public class StudyPackage {

    @Id
    @SequenceGenerator(name = "study_packages_id_seq_generator", sequenceName = "study_packages_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "study_packages_id_seq_generator")
    private Long id;

    @Column(name = "name", nullable = false, length = 512)
    private String name;

    @Column(name = "version", nullable = false, length = 128)
    private String version;

    @Column(name = "catalog_address", length = 1024)
    private String catalogAddress;

    @Column(name = "script", columnDefinition = "TEXT")
    private String script;

    @Column(name = "installed_at", nullable = false)
    private Instant installedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "studyPackage")
    private List<StudyRun> runs = new ArrayList<>();
}

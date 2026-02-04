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
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * A single run of a study package. Tracks status, result path, and logs.
 */
@Getter
@Setter
@Entity
@Table(name = "study_runs")
public class StudyRun {

    @Id
    @SequenceGenerator(name = "study_runs_id_seq_generator", sequenceName = "study_runs_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "study_runs_id_seq_generator")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_package_id", nullable = false)
    private StudyPackage studyPackage;

    @Column(name = "status", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private StudyRunStatus status = StudyRunStatus.RUNNING;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(name = "result_path", length = 1024)
    private String resultPath;

    @Column(name = "logs", columnDefinition = "TEXT")
    private String logs;

    public enum StudyRunStatus {
        RUNNING,
        COMPLETED,
        FAILED,
        ABORTED
    }
}

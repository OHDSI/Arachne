/*
 * Copyright 2024 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.engine;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "engine_status")
@NoArgsConstructor
public class ExecutionEngineStatus {
    @Id
    @Column(name = "id")
    private UUID id;

    /**
     * Moment when the status was observed for the first time
     */
    @Column(name = "since")
    private Instant since;

    /**
     * Moment when the status was observed last time.
     */
    @Column(name = "seen_last")
    private Instant seenLast;

    /**
     * Error observed. Null if the record marks interval when EE was connected without errors
     */
    @Column(name = "error")
    private String error;
}

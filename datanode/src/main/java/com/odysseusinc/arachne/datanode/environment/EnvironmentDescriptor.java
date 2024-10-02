/*
 * Copyright 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.environment;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "environment_descriptor")
@Getter
@Setter
public class EnvironmentDescriptor {
    @SequenceGenerator(name = "descriptor_id_seq", sequenceName = "descriptor_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "descriptor_id_seq")
    @Id
    @Column(name = "id")
    private Long id;
    
    @Column(name = "descriptor_id")
    private String descriptorId;

    @Column(name = "json")
    private String json;

    @Column(name = "label")
    private String label;

    @Column(name = "base")
    private boolean base;

    @Column(name = "terminated")
    private Instant terminated;

    @Column(name = "type")
    private String type;

    public interface Type {
        String DOCKER = "docker";
        String TARBALL = "tarball";
    }
}

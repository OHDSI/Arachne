/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexandr Ryabokon
 * Created: April 19, 2017
 *
 */

package com.odysseusinc.arachne.system.settings.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "system_settings")
public class SystemSetting {

    @Id
    @SequenceGenerator(name = "system_settings_pk_sequence", sequenceName = "system_settings_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "system_settings_pk_sequence")
    private Long id;

    @ManyToOne(targetEntity = SystemSettingsGroup.class)
    private SystemSettingsGroup group;

    @Column
    private String label;

    @Column
    private String name;

    @Column
    private String value;

    @Column
    @Enumerated(EnumType.STRING)
    private SystemSettingType type;

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public SystemSettingsGroup getGroup() {

        return group;
    }

    public void setGroup(SystemSettingsGroup group) {

        this.group = group;
    }

    public String getLabel() {

        return label;
    }

    public void setLabel(String label) {

        this.label = label;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getValue() {

        return value;
    }

    public void setValue(String value) {

        this.value = value;
    }

    public SystemSettingType getType() {

        return type;
    }

    public void setType(SystemSettingType type) {

        this.type = type;
    }
}

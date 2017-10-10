/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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

import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "system_settings_groups")
public class SystemSettingsGroup {

    @Id
    @SequenceGenerator(name = "system_settings_groups_pk_sequence",
            sequenceName = "system_settings_groups_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "system_settings_groups_pk_sequence")
    private Long id;

    @Column
    private String label;

    @Column
    private String name;

    @OneToMany(targetEntity = SystemSetting.class,mappedBy = "group")
    @OrderBy("id ASC")
    private List<SystemSetting> settings;

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
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

    public List<SystemSetting> getSettings() {

        return settings;
    }

    public void setSettings(List<SystemSetting> settings) {

        this.settings = settings;
    }
}

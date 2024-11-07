/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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
package com.odysseusinc.arachne.datanode.model.analysis;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "analysis_state_journal")
@Getter
@Setter
public class AnalysisStateEntry {

    @Id
    @SequenceGenerator(name = "analyses_state_pk_sequence", sequenceName = "analysis_state_journal_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "analyses_state_pk_sequence")
    private Long id;
    @Column(name = "date")
    private Date date;
    @Column(name = "command")
    @Enumerated(value = EnumType.STRING)
    private AnalysisCommand command;
    @Column(name = "reason")
    private String reason;
    @ManyToOne(fetch = FetchType.EAGER)
    private Analysis analysis;
    @Column(name = "stage")
    private String stage;
    @Column(name = "error")
    private String error;
}

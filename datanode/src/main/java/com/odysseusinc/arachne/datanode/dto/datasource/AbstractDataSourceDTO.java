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

package com.odysseusinc.arachne.datanode.dto.datasource;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.KerberosAuthMechanism;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public abstract class AbstractDataSourceDTO {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private String dbmsType;
    @NotNull
    private String connectionString;
    @NotBlank
    private String cdmSchema;
    private String dbUsername;
    private String dbPassword;
    private String targetSchema;
    private String resultSchema;
    private String cohortTargetTable;
    private Boolean useKerberos = Boolean.FALSE;
    private String krbRealm;
    private String krbFQDN;
    private String krbUser;
    private String krbPassword;
    private KerberosAuthMechanism krbAuthMechanism;
}

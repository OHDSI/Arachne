/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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

import com.odysseusinc.arachne.commons.api.v1.dto.CommonHealthStatus;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType;
import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.KerberosAuthMechanism;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class DataSourceDTO {

    private Long id;
    private Long centralId;

    private String uuid;
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private DBMSType dbmsType;

    @NotBlank
    private String connectionString;

    @NotBlank
    private String cdmSchema;

    @NotBlank
    private String dbUsername;

    private String dbPassword;

    private CommonModelType modelType;

    private CommonHealthStatus healthStatus;
    private String healthStatusDescription;

    private String targetSchema;
    private String resultSchema;
    private String cohortTargetTable;

    private Boolean published;

    private Boolean useKerberos;
    private String krbRealm;
    private String krbFQDN;
    private String krbUser;
    private String krbPassword;
    private Boolean hasKeytab;
    private KerberosAuthMechanism krbAuthMechanism;

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public Long getCentralId() {
        return centralId;
    }

    public void setCentralId(Long centralId) {
        this.centralId = centralId;
    }

    public String getUuid() {

        return uuid;
    }

    public void setUuid(String uuid) {

        this.uuid = uuid;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getDescription() {

        return description;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    public DBMSType getDbmsType() {

        return dbmsType;
    }

    public void setDbmsType(DBMSType dbmsType) {

        this.dbmsType = dbmsType;
    }

    public String getConnectionString() {

        return connectionString;
    }

    public void setConnectionString(String connectionString) {

        this.connectionString = connectionString;
    }

    public String getCdmSchema() {

        return cdmSchema;
    }

    public void setCdmSchema(String cdmSchema) {

        this.cdmSchema = cdmSchema;
    }

    public String getDbUsername() {

        return dbUsername;
    }

    public void setDbUsername(String dbUsername) {

        this.dbUsername = dbUsername;
    }

    public String getDbPassword() {

        return dbPassword;
    }

    public void setDbPassword(String dbPassword) {

        this.dbPassword = dbPassword;
    }

    public CommonHealthStatus getHealthStatus() {

        return healthStatus;
    }

    public void setHealthStatus(CommonHealthStatus healthStatus) {

        this.healthStatus = healthStatus;
    }

    public String getHealthStatusDescription() {

        return healthStatusDescription;
    }

    public void setHealthStatusDescription(String healthStatusDescription) {

        this.healthStatusDescription = healthStatusDescription;
    }

    public String getTargetSchema() {
        return targetSchema;
    }

    public void setTargetSchema(String targetSchema) {
        this.targetSchema = targetSchema;
    }

    public String getResultSchema() {
        return resultSchema;
    }

    public void setResultSchema(String resultSchema) {
        this.resultSchema = resultSchema;
    }

    public String getCohortTargetTable() {
        return cohortTargetTable;
    }

    public void setCohortTargetTable(String cohortTargetTable) {
        this.cohortTargetTable = cohortTargetTable;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public CommonModelType getModelType() {
        return modelType;
    }

    public void setModelType(CommonModelType modelType) {
        this.modelType = modelType;
    }

    public Boolean getUseKerberos() {

        return useKerberos;
    }

    public void setUseKerberos(Boolean useKerberos) {

        this.useKerberos = useKerberos;
    }

    public String getKrbRealm() {

        return krbRealm;
    }

    public void setKrbRealm(String krbRealm) {

        this.krbRealm = krbRealm;
    }

    public String getKrbFQDN() {

        return krbFQDN;
    }

    public void setKrbFQDN(String krbFQDN) {

        this.krbFQDN = krbFQDN;
    }

    public String getKrbUser() {

        return krbUser;
    }

    public void setKrbUser(String krbUser) {

        this.krbUser = krbUser;
    }

    public String getKrbPassword() {

        return krbPassword;
    }

    public void setKrbPassword(String krbPassword) {

        this.krbPassword = krbPassword;
    }

    public Boolean getHasKeytab() {

        return hasKeytab;
    }

    public void setHasKeytab(Boolean hasKeytab) {

        this.hasKeytab = hasKeytab;
    }

    public KerberosAuthMechanism getKrbAuthMechanism() {

        return krbAuthMechanism;
    }

    public void setKrbAuthMechanism(KerberosAuthMechanism krbAuthMechanism) {

        this.krbAuthMechanism = krbAuthMechanism;
    }
}

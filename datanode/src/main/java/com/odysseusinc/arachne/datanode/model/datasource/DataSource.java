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

package com.odysseusinc.arachne.datanode.model.datasource;

import com.google.common.base.MoreObjects;
import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.datanode.dto.datasource.validation.ValidCredentials;
import com.odysseusinc.arachne.datanode.model.types.DataSourcePasswordEncryptedConverter;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.KerberosAuthMechanism;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "datasource")
@SQLDelete(sql = "UPDATE datasource SET deleted_at = current_timestamp, name = name ||'_deleted_source_at_'||to_char(current_timestamp, 'YYYYMMDD\"T\"HH24MISS') WHERE id = ?")
@ValidCredentials
public class DataSource {

    @Id
    @SequenceGenerator(name = "datasource_id_seq_generator", sequenceName = "datasource_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "datasource_id_seq_generator")
    private Long id;

    @Column(name = "sid", nullable = false)
    private String uuid;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "dbms_type", nullable = false)
    private DBMSType type;

    @NotNull
    @Column
    private String connectionString;

    @NotBlank
    @Column(nullable = false)
    private String cdmSchema;

    @Column(name = "dbms_username", nullable = false)
    private String username;


    @Column(name = "dbms_password")
    @Convert(converter = DataSourcePasswordEncryptedConverter.class)
    private String password;

    @Column
    private Date deletedAt;
    
    @Column
    private String healthStatusDescription;

    @Column
    private String targetSchema;

    @Column
    private String resultSchema;

    @Column
    private String cohortTargetTable;

    @Column(name = "use_kerberos")
    private Boolean useKerberos;

    @Column(name = "krb_realm")
    private String krbRealm;

    @Column(name = "krb_fqdn")
    private String krbFQDN;

    @Column(name = "krb_user")
    private String krbUser;

    @Column(name = "krb_keytab")
    private byte[] keyfile;

    @Column(name = "krb_password")
    @Convert(converter = DataSourcePasswordEncryptedConverter.class)
    private String krbPassword;

    @Column(name = "krb_auth_method")
    @Enumerated(EnumType.STRING)
    private KerberosAuthMechanism krbAuthMechanism;

    private Long centralId;

    @Override
    public String toString() {

        return MoreObjects.toStringHelper(this)
                .add("id", id)
                .add("name", name)
                .add("description", description)
                .add("type", type)
                .add("connectionString", connectionString)
                .add("cdmSchema", cdmSchema)
                .add("username", "***")
                .add("password", "***")
                .add("healthStatusDescription", healthStatusDescription)
                .add("targetSchema", targetSchema)
                .add("resultSchema", resultSchema)
                .add("cohortTargetTable", cohortTargetTable)
                .add("centralId", centralId)
                .toString();
    }

}

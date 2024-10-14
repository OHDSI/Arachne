package com.odysseusinc.arachne.datanode.dto.datasource;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.KerberosAuthMechanism;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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

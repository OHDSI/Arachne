package com.odysseusinc.arachne.execution_engine_common.util;

import com.odysseusinc.arachne.execution_engine_common.KrbAuthType;

public class ConnectionParams {
    private String dbms;
    private String server;
    private String user;
    private String password;
    private String port;
    private String schema;
    private String extraSettings;
    private String connectionString;
    private KrbAuthType authMechanism;
    private String krbFQDN;
    private String krbAdminFQDN;
    private String krbRealm;

    public String getConnectionString() {
        return connectionString;
    }

    public void setConnectionString(String connectionString) {
        this.connectionString = connectionString;
    }

    public String getDbms() {

        return dbms;
    }

    public void setDbms(String dbms) {

        this.dbms = dbms;
    }

    public String getServer() {

        return server;
    }

    public void setServer(String server) {

        this.server = server;
    }

    public String getUser() {

        return user;
    }

    public void setUser(String user) {

        this.user = user;
    }

    public String getPassword() {

        return password;
    }

    public void setPassword(String password) {

        this.password = password;
    }

    public String getPort() {

        return port;
    }

    public void setPort(String port) {

        this.port = port;
    }

    public String getSchema() {

        return schema;
    }

    public void setSchema(String schema) {

        this.schema = schema;
    }

    public String getExtraSettings() {

        return extraSettings;
    }

    public void setExtraSettings(String extraSettings) {

        this.extraSettings = extraSettings;
    }

    public KrbAuthType getAuthMechanism() {

        return authMechanism;
    }

    public void setAuthMechanism(KrbAuthType authMechanism) {

        this.authMechanism = authMechanism;
    }

    public String getKrbFQDN() {

        return krbFQDN;
    }

    public void setKrbFQDN(String krbFQDN) {

        this.krbFQDN = krbFQDN;
    }

    public String getKrbAdminFQDN() {

        return krbAdminFQDN;
    }

    public void setKrbAdminFQDN(String krbAdminFQDN) {

        this.krbAdminFQDN = krbAdminFQDN;
    }

    public String getKrbRealm() {

        return krbRealm;
    }

    public void setKrbRealm(String krbRealm) {

        this.krbRealm = krbRealm;
    }
}

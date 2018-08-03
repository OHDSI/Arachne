package com.odysseusinc.arachne.execution_engine_common.api.v1.dto;

public enum KerberosAuthMethod {
    PASSWORD(3), KEYTAB(1), DEFAULT(0);

    private final int type;

    KerberosAuthMethod(int type) {

        this.type = type;
    }

    public static KerberosAuthMethod getByAuthType(Integer type) {

        for (KerberosAuthMethod auth : values()) {
            if (auth.getType() == type) {
                return auth;
            }
        }
        return DEFAULT;
    }

    public int getType() {

        return type;
    }
}

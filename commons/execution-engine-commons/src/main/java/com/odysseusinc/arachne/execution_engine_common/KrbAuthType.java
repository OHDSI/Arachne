package com.odysseusinc.arachne.execution_engine_common;

public enum KrbAuthType {
    AUTHENTICATION_BY_PASSWORD(3),
    AUTHENTICATION_BY_KEYTAB(1),
    DEFAULT(0);

    private final int type;

    KrbAuthType(int type) {

        this.type = type;
    }

    public int getType() {

        return type;
    }
}

package com.odysseusinc.arachne.commons.conditions.modules;

public enum Module {
    INSIGHT("insights-library");

    private final String moduleName;

    Module(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getModuleName() {
        return moduleName;
    }
}

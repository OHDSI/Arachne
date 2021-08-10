package com.odysseusinc.arachne.commons.api.v1.dto;

public enum CommonDataSourceAccessType {
    PUBLIC("PUBLIC"),
    RESTRICTED("RESTRICTED");

    private final String title;

    CommonDataSourceAccessType(String title) {

        this.title = title;
    }

    @Override
    public String toString() {

        return title;
    }
}

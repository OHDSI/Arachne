package com.odysseusinc.arachne.commons.api.v1.dto;

public class AtlasShortDTO {

    private Long id;
    private Long centralId;
    private String name;
    private String version;

    public AtlasShortDTO() {

    }

    public AtlasShortDTO(String name) {

        this.name = name;
    }

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

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getVersion() {

        return version;
    }

    public void setVersion(String version) {

        this.version = version;
    }
}

package com.odysseusinc.arachne.commons.api.v1.dto;

import java.io.Serializable;

public class CommonPredictionDTO extends CommonEntityDTO implements Serializable {
    private String modelType;

    public String getModelType() {

        return modelType;
    }

    public void setModelType(String modelType) {

        this.modelType = modelType;
    }
}

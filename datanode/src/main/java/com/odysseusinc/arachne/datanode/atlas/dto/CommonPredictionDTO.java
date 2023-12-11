package com.odysseusinc.arachne.datanode.atlas.dto;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonEntityDTO;

import java.io.Serializable;

public class CommonPredictionDTO extends CommonEntityDTO implements Serializable {
    public static final CommonAnalysisType PREDICTION = new CommonAnalysisType("PREDICTION", "Patient Level Prediction", "plp");
}

package com.odysseusinc.arachne.datanode.atlas.dto;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonEntityDTO;

import java.io.Serializable;

public class CommonCcShortDTO extends CommonEntityDTO implements Serializable {
    public static final CommonAnalysisType COHORT_CHARACTERIZATION = new CommonAnalysisType("COHORT_CHARACTERIZATION", "Cohort (Characterization)", "cc");
}

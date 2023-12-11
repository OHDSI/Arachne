package com.odysseusinc.atlas.integration;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonEntityDTO;

public class CommonEstimationDTO extends CommonEntityDTO {
	public static final CommonAnalysisType ESTIMATION = new CommonAnalysisType("ESTIMATION", "Population Level Effect Estimation", "ple");

	@Override
	public CommonAnalysisType getType() {

		return ESTIMATION;
	}
}

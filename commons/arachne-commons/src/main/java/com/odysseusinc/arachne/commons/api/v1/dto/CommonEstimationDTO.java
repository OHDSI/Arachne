package com.odysseusinc.arachne.commons.api.v1.dto;

public class CommonEstimationDTO extends CommonEntityDTO {
	@Override
	public CommonAnalysisType getType() {

		return CommonAnalysisType.ESTIMATION;
	}
}

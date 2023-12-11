package com.odysseusinc.arachne.datanode.atlas.impl;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonCohortAnalysisDTO;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonCohortAnalysisType;
import com.odysseusinc.arachne.datanode.atlas.analysis.CommonEstimationDTO;
import com.odysseusinc.arachne.datanode.atlas.dto.EstimationListItem;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.stereotype.Component;

@Component
public class EstimationListItemToCommonCohortAnalysisDTOConverter extends BaseAtlasEntityToCommonEntityDTOConverter<EstimationListItem, CommonCohortAnalysisDTO> {

	public EstimationListItemToCommonCohortAnalysisDTOConverter(GenericConversionService conversionService) {

		super(conversionService);
	}

	@Override
	public CommonCohortAnalysisDTO convert(EstimationListItem source) {

		CommonCohortAnalysisDTO result = super.convert(source);
		result.setAnalysisType(CommonCohortAnalysisType.ESTIMATION);
		result.setLocalId(source.getEstimationId().longValue());
		result.setModified(source.getModifiedDate());
		result.setType(CommonEstimationDTO.ESTIMATION);
		return result;
	}

	@Override
	protected CommonCohortAnalysisDTO getTargetClass() {

		return new CommonCohortAnalysisDTO();
	}
}

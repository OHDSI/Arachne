package com.odysseusinc.arachne.datanode.atlas.impl;

import com.odysseusinc.arachne.datanode.atlas.dto.CommonPathwayDTO;
import com.odysseusinc.arachne.datanode.atlas.dto.Pathway;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.stereotype.Component;

@Component
public class PathwayToCommonPathwayDTOConverter extends BaseAtlasEntityToCommonEntityDTOConverter<Pathway, CommonPathwayDTO> {
    public PathwayToCommonPathwayDTOConverter(GenericConversionService conversionService) {

        super(conversionService);
    }

    @Override
    public CommonPathwayDTO convert(Pathway source) {

        CommonPathwayDTO dto = super.convert(source);
        dto.setLocalId(source.getId());
        dto.setModified(source.getModifiedDate());
        dto.setType(CommonPathwayDTO.COHORT_PATHWAY);
        return dto;
    }

    @Override
    protected CommonPathwayDTO getTargetClass() {

        return new CommonPathwayDTO();
    }
}

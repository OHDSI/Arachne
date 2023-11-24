package com.odysseusinc.arachne.datanode.model.datasource;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonDataSourceAccessType;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType;

public class AutoDetectedFields {

    private String cdmVersion;
    private CommonModelType commonModelType;
    private CommonDataSourceAccessType commonAccessType;

    public AutoDetectedFields() {
    }

    public AutoDetectedFields(CommonModelType commonModelType) {
        this.commonModelType = commonModelType;
    }

    public AutoDetectedFields(CommonModelType commonModelType, String cdmVersion, CommonDataSourceAccessType commonAccessType) {
        this.cdmVersion = cdmVersion;
        this.commonModelType = commonModelType;
        this.commonAccessType = commonAccessType;
    }

    public String getCdmVersion() {
        return cdmVersion;
    }

    public void setCdmVersion(String cdmVersion) {
        this.cdmVersion = cdmVersion;
    }

    public CommonModelType getCommonModelType() {
        return commonModelType;
    }

    public void setCommonModelType(CommonModelType commonModelType) {
        this.commonModelType = commonModelType;
    }

    public CommonDataSourceAccessType getCommonAccessType() {
        return commonAccessType;
    }

    public void setCommonAccessType(CommonDataSourceAccessType commonAccessType) {
        this.commonAccessType = commonAccessType;
    }
}

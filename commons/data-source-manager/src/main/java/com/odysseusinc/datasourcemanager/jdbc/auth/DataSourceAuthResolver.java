package com.odysseusinc.datasourcemanager.jdbc.auth;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.DataSourceUnsecuredDTO;
import java.io.File;

public interface DataSourceAuthResolver {

	boolean supports(DataSourceUnsecuredDTO dataSourceData);

	void resolveAuth(DataSourceUnsecuredDTO dataSourceData, File workDir);
}

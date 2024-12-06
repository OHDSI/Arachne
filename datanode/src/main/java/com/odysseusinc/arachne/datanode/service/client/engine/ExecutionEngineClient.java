package com.odysseusinc.arachne.datanode.service.client.engine;

import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisRequestStatusDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.AnalysisResultDTO;
import com.odysseusinc.arachne.execution_engine_common.api.v1.dto.EngineStatus;
import org.apache.commons.io.function.IOConsumer;

import java.io.OutputStream;
import java.util.List;

public interface ExecutionEngineClient {
    EngineStatus status(List<Long> ids);

    AnalysisResultDTO cancel(long id);

    AnalysisRequestStatusDTO sendAnalysisRequest(
            AnalysisRequestDTO analysisRequest, String analysisTitle, boolean compressedResult, String name, IOConsumer<OutputStream> bodyWriter
    );
}

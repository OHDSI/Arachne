package com.odysseusinc.arachne.datanode.atlas.client;

import com.odysseusinc.arachne.datanode.atlas.dto.ComparativeCohortAnalysis;
import com.odysseusinc.arachne.datanode.atlas.dto.ComparativeCohortAnalysisInfo;
import com.odysseusinc.arachne.datanode.atlas.dto.PatientLevelPredictionInfo;
import feign.Param;
import feign.RequestLine;
import java.util.List;
import java.util.Map;

public interface AtlasClient2_5 extends AtlasClient {
	@RequestLine("GET /plp")
	List<PatientLevelPredictionInfo> getPatientLevelPredictions();

	@RequestLine("GET /plp/{id}")
	Map<String, Object> getPatientLevelPrediction(@Param("id") Integer id);

	@RequestLine("GET /comparativecohortanalysis")
	List<ComparativeCohortAnalysis> getEstimations();

	@RequestLine("GET /comparativecohortanalysis/{id}")
	ComparativeCohortAnalysisInfo getEstimation(@Param("id") Integer id);
}

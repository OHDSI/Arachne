package com.odysseusinc.arachne.datanode.atlas.client;

import com.odysseusinc.arachne.datanode.atlas.AtlasConstants;
import feign.RequestLine;

public interface AtlasInfoClient {
	@RequestLine("GET " + AtlasConstants.INFO)
	AtlasClient.Info getInfo();
}

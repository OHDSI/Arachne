package com.odysseusinc.arachne.datanode.atlas.client;

import com.odysseusinc.arachne.datanode.Constants;
import feign.RequestLine;

public interface AtlasInfoClient {
	@RequestLine("GET " + Constants.Atlas.INFO)
	AtlasClient.Info getInfo();
}

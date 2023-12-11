package com.odysseusinc.arachne.datanode.atlas;

import com.odysseusinc.arachne.datanode.atlas.model.Atlas;
import com.odysseusinc.arachne.datanode.atlas.client.AtlasClient;
import com.odysseusinc.arachne.datanode.atlas.client.AtlasInfoClient;
import com.odysseusinc.arachne.datanode.atlas.client.AtlasLoginClient;
import feign.Client;

public interface AtlasClientService {

    <T extends AtlasClient> T buildAtlasClient(Atlas atlas);

    AtlasInfoClient buildAtlasInfoClient(Atlas atlas);

    AtlasLoginClient buildAtlasLoginClient(String url, Client httpClient);
}

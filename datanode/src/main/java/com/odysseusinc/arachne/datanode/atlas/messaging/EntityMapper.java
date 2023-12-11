package com.odysseusinc.arachne.datanode.atlas.messaging;

import com.odysseusinc.arachne.datanode.atlas.dto.BaseAtlasEntity;
import com.odysseusinc.arachne.datanode.atlas.client.AtlasClient;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface EntityMapper<L extends BaseAtlasEntity, T, C extends AtlasClient> {

	List<L> getEntityList(C client);

	List<MultipartFile> mapEntity(T entity);
}

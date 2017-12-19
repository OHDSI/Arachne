package com.odysseusinc.arachne.jcr.service;

import com.odysseusinc.arachne.jcr.model.ArachneFileSourced;
import com.odysseusinc.arachne.jcr.model.ArachneFileMeta;
import com.odysseusinc.arachne.jcr.model.QuerySpec;
import java.io.File;
import java.util.List;

public interface ContentStorageService {

    String getJcrLocationForEntity(Object domainObject, List<String> additionalPathParts);

    ArachneFileSourced getFileByFn(String absoulteFilename);

    ArachneFileSourced getFileByIdentifier(String identifier);

    ArachneFileMeta saveFile(String path, String name, File file, Long createdById);

    List<ArachneFileMeta> searchFiles(QuerySpec querySpec);
}

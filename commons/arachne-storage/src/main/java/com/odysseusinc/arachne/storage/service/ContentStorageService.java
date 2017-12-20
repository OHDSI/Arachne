package com.odysseusinc.arachne.storage.service;

import com.odysseusinc.arachne.storage.model.ArachneFileSourced;
import com.odysseusinc.arachne.storage.model.ArachneFileMeta;
import com.odysseusinc.arachne.storage.model.QuerySpec;
import java.io.File;
import java.io.Serializable;
import java.util.List;

public interface ContentStorageService {

    String getLocationForEntity(String entityTableName, Serializable entityIdentifier, List<String> additionalPathParts);

    String getLocationForEntity(Object domainObject, List<String> additionalPathParts);

    ArachneFileSourced getFileByPath(String absoulteFilename);

    ArachneFileMeta saveFile(String filepath, File file, Long createdById);

    List<ArachneFileSourced> searchFiles(QuerySpec querySpec);

    void deleteByPath(String identifier);
}

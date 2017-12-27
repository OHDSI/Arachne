package com.odysseusinc.arachne.storage.service;

import com.odysseusinc.arachne.storage.model.ArachneFileMeta;
import com.odysseusinc.arachne.storage.model.QuerySpec;
import java.io.File;
import java.io.InputStream;
import java.io.Serializable;
import java.util.List;

public interface ContentStorageService {

    String PATH_SEPARATOR = "/";

    String getLocationForEntity(String entityTableName, Serializable entityIdentifier, List<String> additionalPathParts);

    String getLocationForEntity(Class domainClazz, Serializable entityId, List<String> additionalPathParts);

    String getLocationForEntity(Object domainObject, List<String> additionalPathParts);

    ArachneFileMeta getFileByPath(String absoulteFilename);

    InputStream getContentByFilepath(String absoulteFilename);

    ArachneFileMeta saveFile(String filepath, File file, Long createdById);

    List<ArachneFileMeta> searchFiles(QuerySpec querySpec);

    void deleteByPath(String identifier);
}

package com.odysseusinc.arachne.storage.model;

import com.odysseusinc.arachne.commons.utils.CommonFileUtils;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.Date;
import org.apache.commons.lang3.NotImplementedException;

public interface ArachneFileMeta {

    String getUuid();

    // Default due to back-compatibility
    default String getPath() {

        return null;
    }

    default String getName() {

        return Paths.get(getPath()).getFileName().toString();
    }

    Date getCreated();

    default Long getCreatedBy() {

        return null;
    }

    Date getUpdated();

    String getContentType();

    static Comparator<ArachneFileMeta> getComparator() {

        return (ArachneFileMeta o1, ArachneFileMeta o2) -> {
            if (o1.getContentType().equals(CommonFileUtils.TYPE_FOLDER)
                    && o2.getContentType().equals(CommonFileUtils.TYPE_FOLDER)) {
                return -1 * o1.getName().compareTo(o2.getName());
            } else if (o1.getContentType().equals(CommonFileUtils.TYPE_FOLDER)) {
                return -1;
            } else {
                return 1;
            }
        };
    }

    ;
}

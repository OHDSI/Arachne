package com.odysseusinc.arachne.commons.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.odysseusinc.arachne.commons.api.v1.dto.CommonAnalysisType;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;

public class AnalysisArchiveUtils {

    public static final String NAME_FILED = "name";

    private static final String ARCHIVE_FILE_NAME_FORMAT = "%s-%s-%s.zip";
    public static final String ARCHIVE_FILE_NAME_DELIMITER = "_";
    private static DateTimeFormatter ARCHIVE_FILE_DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    public static String getAnalysisName(Map<String, ? extends Object> analysisMap) {

        if (MapUtils.isEmpty(analysisMap) || !analysisMap.containsKey(NAME_FILED)) {
            return StringUtils.EMPTY;
        }
        return analysisMap.get("name").toString();
    }

    public static String getAnalysisName(JsonNode analysis) {

        if (analysis == null || analysis.get("name") == null) {
            return StringUtils.EMPTY;
        }
        return analysis.get("name").asText();
    }

    public static String getArchiveFileName(CommonAnalysisType type, String name, LocalDateTime dateTime) {

        return String.format(
                ARCHIVE_FILE_NAME_FORMAT,
                getCodeString(type), getNameString(name), getDateTimeString(dateTime)
        );
    }

    public static String getArchiveFileName(CommonAnalysisType type, String name) {

        return getArchiveFileName(type, name, LocalDateTime.now());
    }

    private static String getCodeString(CommonAnalysisType type) {

        if (type == null) {
            throw new IllegalStateException("Cannot generate archive name without analysis type.");
        }
        return type.getCode();
    }

    private static String getNameString(String name) {

        if (StringUtils.isBlank(name)) {
            throw new IllegalStateException("Cannot generate archive name without name.");
        }


        String nameWithoutSpecialCharacters = name.replaceAll("\\W", StringUtils.SPACE);

        return StringUtils.normalizeSpace(nameWithoutSpecialCharacters)
                .toLowerCase()
                .replaceAll("\\s", ARCHIVE_FILE_NAME_DELIMITER); //replace all space with dash

    }

    private static String getDateTimeString(LocalDateTime dateTime) {

        if (dateTime == null) {
            throw new IllegalStateException("Cannot generate archive name without date time.");
        }

        return dateTime.format(ARCHIVE_FILE_DATETIME_FORMATTER);
    }
}

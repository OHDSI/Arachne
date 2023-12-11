package com.odysseusinc.arachne.datanode.atlas;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.odysseusinc.arachne.datanode.atlas.dto.CohortDefinition;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AnalysisInfoBuilder {

    private static final Logger log = LoggerFactory.getLogger(AnalysisInfoBuilder.class);

    public String generateCountAnalysisDescription(CohortDefinition cohort) {

        StringBuilder description = new StringBuilder();
        if (StringUtils.isNotBlank(cohort.getDescription())) {
            appendLine(description, "Cohort: " + cohort.getName());
            appendLine(description, "Description: " + cohort.getDescription());
        }
        appendLine(description, "Created by: " + cohort.getCreatedBy());
        return description.toString();
    }

    public String generateHeraclesAnalysisDescription(CohortDefinition cohort) {

        StringBuilder description = new StringBuilder();
        appendLine(description, "Heracles analysis of the Cohort: " + cohort.getName());
        appendLine(description, "Cohort Description: " + cohort.getDescription());
        return description.toString();    }

    public String generateCCAnalysisDescription(JsonNode analysisJson) {

        StringBuilder description = new StringBuilder();
        try {
            appendLine(description, "included cohorts:");
            final JsonNode cohorts = analysisJson.get("cohorts");
            for (JsonNode cohortNode : cohorts) {
                appendLine(description, cohortNode.get("name"));
            }
            appendLine(description, StringUtils.EMPTY);

            appendLine(description, "List of the featured analyses:");
            final ArrayNode featuredAnalyses = (ArrayNode) analysisJson.get("featureAnalyses");
            for (JsonNode analysis : featuredAnalyses) {
                appendLine(description, analysis.get("name"));
            }
        } catch (Exception ex) {
            log.warn("Cannot build analysis description: {}", analysisJson);
        }
        return description.toString();
    }

    public String generatePathwayAnalysisDescription(String analysisName, JsonNode targetCohortsNode, JsonNode eventCohortsNode) {

        StringBuilder description = new StringBuilder();
        appendLine(description, analysisName);
        appendLine(description, StringUtils.EMPTY);

        try {
            appendLine(description, "target cohorts:");
            for (JsonNode targetCohortNode : targetCohortsNode) {
                appendLine(description, targetCohortNode.get("name"));
            }
            appendLine(description, StringUtils.EMPTY);

            appendLine(description, "event cohorts:");
            for (JsonNode eventCohortNode : eventCohortsNode) {
                appendLine(description, eventCohortNode.get("name"));
            }
        } catch (Exception ex) {
            log.warn("Cannot build analysis description: {} {}", targetCohortsNode, eventCohortsNode);
        }
        return description.toString();
    }

    public String generatePredictionAnalysisDescription(JsonNode analysis) {

        StringBuilder description = new StringBuilder();
        try {
            appendLine(description, analysis.get("name"));
            appendLine(description, analysis.get("description"));
        } catch (Exception ex) {
            log.warn("Cannot build analysis description");
        }
        return description.toString();
    }

    private static void appendLine(StringBuilder builder, JsonNode textNode) {

        if (textNode != null && !textNode.isNull()) {
            builder.append(textNode.asText());
            builder.append(System.lineSeparator());
        }
    }

    private static void appendLine(StringBuilder builder, String text) {

        builder.append(text);
        builder.append(System.lineSeparator());
    }
}

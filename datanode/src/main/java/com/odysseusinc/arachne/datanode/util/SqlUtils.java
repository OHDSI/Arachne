/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

package com.odysseusinc.arachne.datanode.util;

import com.google.common.collect.ImmutableMap;
import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.ohdsi.sql.SqlRender;
import org.ohdsi.sql.SqlTranslate;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class SqlUtils {

    private final ApplicationContext applicationContext;

    public SqlUtils(ApplicationContext applicationContext) {

        this.applicationContext = applicationContext;
    }

    public String transformSqlTemplate(DataSource dataSource, String name) throws IOException {

        String sql = readSql(name);
        final DBMSType target = dataSource.getType();
        final String cdmSchema = dataSource.getCdmSchema();
        final String targetSchema = dataSource.getTargetSchema();
        final String resultSchema = dataSource.getResultSchema();
        final String cohortTargetTable = dataSource.getCohortTargetTable();
        final TranslateOptions options = new TranslateOptions(
                cdmSchema,
                StringUtils.defaultIfEmpty(targetSchema, cdmSchema),
                StringUtils.defaultIfEmpty(resultSchema, cdmSchema),
                cdmSchema,
                StringUtils.defaultIfEmpty(cohortTargetTable, "cohort"),
                0
        );
        final String nativeStatement
                = translateSQL(sql, null, target, SqlTranslate.generateSessionId(), resultSchema, options);
        return nativeStatement;
    }

    protected String readSql(String name) throws IOException {

        Resource resource = applicationContext.getResource(name);
        try (Reader reader = new InputStreamReader(resource.getInputStream())) {
            return IOUtils.toString(reader);
        }
    }

    /**
     * @param sourceStatement MS SQL Statement
     * @param parameters      Atlas original parameters (NULL at Atlas'es controller)
     * @param dbmsType        DBMSType for target Native SQL
     * @param options         Parameters for placeholders replacement (e.g. CDM schema, Cohorts table, etc)
     * @return Native SQL in accordiance with dbmsType
     */
    public static String translateSQL(String sourceStatement, Map<String, String> parameters,
                                      DBMSType dbmsType, String sessionId, String tempSchema, TranslateOptions options) {

        String translated;
        try {
            String[] parameterKeys = getMapKeys(parameters);
            String[] parameterValues = getMapValues(parameters, parameterKeys);

            String renderedSQL = SqlRender.renderSql(sourceStatement, parameterKeys, parameterValues);

            if (dbmsType == null
                    || DBMSType.MS_SQL_SERVER == dbmsType
                    || DBMSType.PDW == dbmsType) {
                translated = renderedSQL;
            } else {
                translated = translateSql(dbmsType.getOhdsiDB(), sessionId, tempSchema, renderedSQL);
            }
        } catch (Exception exception) {
            throw new RuntimeException(exception);
        }
        return processPlaceHolders(translated, options);
    }

    public static synchronized String translateSql(String dbmsType, String sessionId, String tempSchema, String renderedSQL) {

        // Oracle fails with a single query ending with semicolon. That's why we remove the semicolon after translation
        return SqlTranslate.translateSql(
                renderedSQL,
                dbmsType,
                sessionId,
                tempSchema
        ).replaceAll(";\\s*$", "");
    }

    private static String processPlaceHolders(String expression, TranslateOptions options) {

        for (Map.Entry<String, String> replacement : options.replacements.entrySet()) {
            expression = expression.replaceAll(replacement.getKey(), replacement.getValue());
        }
        return expression;
    }

    private static String[] getMapKeys(Map<String, String> parameters) {

        if (parameters == null) {
            return null;
        } else {
            return parameters.keySet().toArray(new String[parameters.keySet().size()]);
        }
    }

    private static String[] getMapValues(Map<String, String> parameters, String[] parameterKeys) {

        ArrayList<String> parameterValues = new ArrayList<>();
        if (parameters == null) {
            return null;
        } else {
            for (String parameterKey : parameterKeys) {
                parameterValues.add(parameters.get(parameterKey));
            }
            return parameterValues.toArray(new String[parameterValues.size()]);
        }
    }
    public static class TranslateOptions {


        private final Map<String, String> replacements;

        public TranslateOptions(String cdmDataBaseSchema,
                                String targetDataBaseSchema,
                                String resultsDatabaseSchema,
                                String vocabDatabaseSchema,
                                String targetCohortTable,
                                int targetCohortId) {

            replacements = ImmutableMap.<String, String>builder()
                    .put("@cdm_database_schema", cdmDataBaseSchema)
                    .put("@results_database_schema", resultsDatabaseSchema)
                    .put("@target_database_schema", targetDataBaseSchema)
                    .put("@vocab_database_schema", vocabDatabaseSchema)
                    .put("@vocabulary_database_schema", vocabDatabaseSchema)
                    .put("@target_cohort_table", targetCohortTable)
                    .put("@target_cohort_id", String.valueOf(targetCohortId))
                    .put("@generateStats;", "1")
                    .build();
        }
    }
}

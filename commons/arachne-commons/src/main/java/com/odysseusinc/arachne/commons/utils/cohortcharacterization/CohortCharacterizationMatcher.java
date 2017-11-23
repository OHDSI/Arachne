/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: August 08, 2017
 *
 */

package com.odysseusinc.arachne.commons.utils.cohortcharacterization;

import com.google.gson.stream.JsonReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamSource;

public class CohortCharacterizationMatcher {

    private static final Logger log = LoggerFactory.getLogger(CohortCharacterizationMatcher.class);

    private static final String COHORT_CHARACTERIZATION_EXT = ".json";

    private static Map<String, CohortCharacterizationDocType> docTypeStrings
            = new HashMap<>();

    static {

        putToMap(CohortCharacterizationDocType.DASHBOARD, Dashboard.class);
        putToMap(CohortCharacterizationDocType.PERSON, Person.class);
        putToMap(CohortCharacterizationDocType.OBSERVATION_PERIODS, ObservationPeriods.class);
        putToMap(CohortCharacterizationDocType.DATA_DENSITY, DataDensity.class);
        putToMap(CohortCharacterizationDocType.DEATH, Death.class);
        putToMap(CohortCharacterizationDocType.CONDITIONS, Conditions.class);
        putToMap(CohortCharacterizationDocType.CONDITIONERA, ConditionEra.class);
        putToMap(CohortCharacterizationDocType.OBSERVATIONS, Observations.class);
        putToMap(CohortCharacterizationDocType.DRUGERA, Drugera.class);
        putToMap(CohortCharacterizationDocType.DRUG, Drug.class);
        putToMap(CohortCharacterizationDocType.DRUGSBYINDEX, DrugsByIndex.class);
        putToMap(CohortCharacterizationDocType.PROCEDURES, Procedures.class);
        putToMap(CohortCharacterizationDocType.VISITS, Visits.class);
        putToMap(CohortCharacterizationDocType.ACHILLESHEEL, AchillesHeel.class);
        putToMap(CohortCharacterizationDocType.COHORTPECIFIC, CohortSpecific.class);
        putToMap(CohortCharacterizationDocType.HERACLESHEEL, HeraclesHeel.class);
        putToMap(CohortCharacterizationDocType.PROCEDURES_BY_INDEX, ProceduresByIndex.class);
        putToMap(CohortCharacterizationDocType.CONDITIONS_BY_INDEX, ConditionsByIndex.class);
        putToMap(CohortCharacterizationDocType.DATA_COMPLETENESS, DataCompleteness.class);
        putToMap(CohortCharacterizationDocType.ENTROPY, Entropy.class);
    }

    public static CohortCharacterizationDocType getCohortCharacterizationType(String fileName, InputStreamSource inputStreamSource) {

        CohortCharacterizationDocType docType = CohortCharacterizationDocType.UNKNOWN;
        if (!fileName.endsWith(COHORT_CHARACTERIZATION_EXT)) {
            return docType;
        }
        try {
            final JsonReader jsonReader = new JsonReader(new InputStreamReader(inputStreamSource.getInputStream()));
            List<String> names = new ArrayList<>();
            jsonReader.beginObject();
            while (jsonReader.hasNext()) {
                names.add(jsonReader.nextName());
                jsonReader.skipValue();
            }
            final String fieldString = names.stream().sorted().collect(Collectors.joining());
            docType = docTypeStrings.getOrDefault(fieldString, CohortCharacterizationDocType.UNKNOWN);
        } catch (FileNotFoundException e) {
            log.error(e.getMessage());
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return docType;
    }

    private static void putToMap(CohortCharacterizationDocType docType, Class<? extends CohortCharacterizationJson> aClass) {

        final Field[] declaredFields = aClass.getDeclaredFields();
        final String fields = Arrays.asList(declaredFields).stream()
                .map(Field::getName)
                .sorted(String::compareTo)
                .collect(Collectors.joining());
        docTypeStrings.put(fields, docType);
    }
}

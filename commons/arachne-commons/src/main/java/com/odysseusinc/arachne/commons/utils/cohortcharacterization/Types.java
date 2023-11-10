/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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

class Types {

    static class Boxplot {
        public String CATEGORY;
        public long MIN_VALUE;
        public long P10_VALUE;
        public long P25_VALUE;
        public long MEDIAN_VALUE;
        public long P75_VALUE;
        public long P90_VALUE;
        public long MAX_VALUE;
        public long CONCEPT_ID;
    }

    static class Histogram {

    }

    static class Donut {
        public long CONCEPT_ID;
        public long COUNT_VALUE;
        public String CONCEPT_NAME;
    }

    static class Line {
        public String SERIES_NAME;
        public long X_LENGTH_OF_OBSERVATION;
        public float Y_PERCENT_PERSONS;
    }

    static class LineData {
        public long INTERVAL_INDEX;
        public long COUNT_VALUE;
        public float PERCENT_VALUE;
    }

    static class LineMetaData {
        public long MIN_VALUE;
        public long MAX_VALUE;
        public long INTERVAL_SIZE;
    }

    static class LineWLegend {
        public String SERIES_NAME;
        public String X_CALENDAR_MONTH;
        public float Y_RECORD_COUNT;
    }

    static class LineDataByMonth {
        public long MONTH_YEAR;
        public long COUNT_VALUE;
        public float PERCENT_VALUE;
    }

    static class TrellisLine {
        public String TRELLIS_NAME;
        public String SERIES_NAME;
        public String X_CALENDAR_YEAR;
        public float Y_PREVALENCE_1000PP;
        public long NUM_PERSONS;
    }

    static class TreeMap {
        public long CONCEPT_ID;
        public String CONCEPT_PATH;
        public long NUM_PERSONS;
        public float PERCENT_PERSONS;
        public float RECORDS_PER_PERSON;
    }

    static class TreeMapEra {
        public long CONCEPT_ID;
        public String CONCEPT_PATH;
        public long NUM_PERSONS;
        public float PERCENT_PERSONS;
        public float LENGTH_OF_ERA;
    }
}

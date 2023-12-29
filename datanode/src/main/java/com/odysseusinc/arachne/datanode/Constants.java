/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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
 */

package com.odysseusinc.arachne.datanode;

public interface Constants {


    String LOGIN_REGEX = "^[_'.@A-Za-z0-9-]*$";
    String DUMMY_PASSWORD = "password_was_set";

    interface Api {
        String PATTERN = "/api/**";

        interface Analysis {
            String INVALIDATE_ALL_UNFINISHED = "/api/v1/admin/analysis/invalidate";
        }

        interface DataSource {
            String ADD = "/api/v1/data-sources";
            String ALL = "/api/v1/data-sources";
            String GET = "/api/v1/data-sources/{id}";
            String DELETE = "/api/v1/data-sources/{id}";
            String UPDATE = "/api/v1/data-sources/{id}";
            String CENTRAL_REGISTER = "/api/v1/data-sources/{id}/register-on-central";
            String DS_MODEL_CHECK_FIRSTCHECK ="/api/v1/data-sources/{id}/check/result/{password}/firstcheck";
            String DS_MODEL_CHECK_UPDATE = "/api/v1/data-sources/{id}/check/update/{password}";
            String GET_BUSINESS = "/api/v1/data-sources/{id}/business";
            String UPDATE_BUSINESS = "/api/v1/data-sources/{id}/business";
            String DELETE_KEYTAB = "/api/v1/data-sources/{id}/keytab";
        }
    }

    interface Analysis {
        String ERROR_REPORT_FILENAME = "errorReport.txt";
        String ERROR_REPORTR_FILENAME = "errorReportR.txt";
        String SUBMISSION_ARCHIVE_SUBDIR = "archive";
    }

}

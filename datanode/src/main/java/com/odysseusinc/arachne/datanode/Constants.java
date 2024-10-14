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

    interface Analysis {
        String ERROR_REPORT_FILENAME = "errorReport.txt";
        String ERROR_REPORTR_FILENAME = "errorReportR.txt";
        String SUBMISSION_ARCHIVE_SUBDIR = "archive";
    }

}

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
 * Created: January 13, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import java.util.List;

public class CommonAnalysisDTO extends CommonUuidDTO {
    private Long id;
    private String name;
    private CommonArachneUserDTO owner;
    private CommonAnalysisResultDTO result;
    private String executableFileName;
    private String innerExecutableFilename;
    private Long centralDataSourceId;
    private String updateSubmissionStatusPassword;
    private List<String> archiveChunkUrls;
    private List<CommonAnalysisFileDTO> analysisFiles;
    private CommonStudyDTO study;
    private CommonAnalysisType type;

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public CommonArachneUserDTO getOwner() {

        return owner;
    }

    public void setOwner(CommonArachneUserDTO owner) {

        this.owner = owner;
    }

    public CommonAnalysisResultDTO getResult() {

        return result;
    }

    public void setResult(CommonAnalysisResultDTO result) {

        this.result = result;
    }

    public String getExecutableFileName() {

        return executableFileName;
    }

    public void setExecutableFileName(String executableFileName) {

        this.executableFileName = executableFileName;
    }

    public Long getCentralDataSourceId() {
        return centralDataSourceId;
    }

    public void setCentralDataSourceId(Long centralDataSourceId) {
        this.centralDataSourceId = centralDataSourceId;
    }

    public String getUpdateSubmissionStatusPassword() {

        return updateSubmissionStatusPassword;
    }

    public void setUpdateSubmissionStatusPassword(String updateSubmissionStatusPassword) {

        this.updateSubmissionStatusPassword = updateSubmissionStatusPassword;
    }

    public List<String> getArchiveChunkUrls() {

        return archiveChunkUrls;
    }

    public void setArchiveChunkUrls(List<String> archiveChunkUrls) {

        this.archiveChunkUrls = archiveChunkUrls;
    }

    public CommonStudyDTO getStudy() {

        return study;
    }

    public void setStudy(CommonStudyDTO study) {

        this.study = study;
    }

    public CommonAnalysisType getType() {

        return type;
    }

    public void setType(CommonAnalysisType type) {

        this.type = type;
    }

    public List<CommonAnalysisFileDTO> getAnalysisFiles() {

        return analysisFiles;
    }

    public void setAnalysisFiles(List<CommonAnalysisFileDTO> analysisFiles) {

        this.analysisFiles = analysisFiles;
    }

    public String getInnerExecutableFilename() {

        return innerExecutableFilename;
    }

    public void setInnerExecutableFilename(String innerExecutableFilename) {

        this.innerExecutableFilename = innerExecutableFilename;
    }
}


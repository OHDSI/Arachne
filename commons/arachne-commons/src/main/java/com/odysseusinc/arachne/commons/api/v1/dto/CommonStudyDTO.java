/**
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

import java.util.Collection;

public class CommonStudyDTO extends CommonUuidDTO {

    private Long id;
    private String name;
    private String objective;
    private String rationale;
    private String requirements;

    private long proposalTimestamp;
    private long launchTimestamp;
    private long closureDate;

    private CommonClinicalStudyTypeDTO type;
    private CommonStudyStatusDTO status;
    private CommonArachneUserDTO owner;

    private CommonDiseaseAreaDTO diseaseArea;

    private Collection<CommonAnalysisDTO> data;
    private Collection<CommonStudyCommentDTO> comments;
    private Collection<CommonArachneUserGroupDTO> groups;

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

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public long getProposalTimestamp() {
        return proposalTimestamp;
    }

    public void setProposalTimestamp(long proposalTimestamp) {
        this.proposalTimestamp = proposalTimestamp;
    }

    public long getLaunchTimestamp() {
        return launchTimestamp;
    }

    public void setLaunchTimestamp(long launchTimestamp) {
        this.launchTimestamp = launchTimestamp;
    }

    public long getClosureDate() {
        return closureDate;
    }

    public void setClosureDate(long closureDate) {
        this.closureDate = closureDate;
    }

    public CommonClinicalStudyTypeDTO getType() {
        return type;
    }

    public void setType(CommonClinicalStudyTypeDTO type) {
        this.type = type;
    }

    public CommonStudyStatusDTO getStatus() {
        return status;
    }

    public void setStatus(CommonStudyStatusDTO status) {
        this.status = status;
    }

    public CommonArachneUserDTO getOwner() {
        return owner;
    }

    public void setOwner(CommonArachneUserDTO owner) {
        this.owner = owner;
    }

    public Collection<CommonAnalysisDTO> getData() {
        return data;
    }

    public void setData(Collection<CommonAnalysisDTO> data) {
        this.data = data;
    }

    public Collection<CommonStudyCommentDTO> getComments() {
        return comments;
    }

    public void setComments(Collection<CommonStudyCommentDTO> comments) {
        this.comments = comments;
    }

    public Collection<CommonArachneUserGroupDTO> getGroups() {
        return groups;
    }

    public void setGroups(Collection<CommonArachneUserGroupDTO> groups) {
        this.groups = groups;
    }

    public CommonDiseaseAreaDTO getDiseaseArea() {
        return diseaseArea;
    }

    public void setDiseaseArea(CommonDiseaseAreaDTO diseaseArea) {
        this.diseaseArea = diseaseArea;
    }
}

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
 * Created: February 01, 2017
 *
 */

package com.odysseusinc.arachne.commons.api.v1.dto;

import java.util.Map;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;


public class CommonMetadataAttrDTO {

    private Long id;

    @NotBlank
    @Length.List({
            @Length(min = 3, message = "The field must be at least 3 characters"),
            @Length(max = 1000, message = "The field must be less than 255 characters")
    })
    private String name;

    @NotNull
    private String type;

    private Boolean required;
    private Boolean searchable;
    private Boolean faceted;
    private Boolean showInList;
    private Map<Long, Object> options;

    private Integer currentMinValue;
    private Integer currentMaxValue;

    private Integer order;

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

    public String getType() {

        return type;
    }

    public void setType(String type) {

        this.type = type;
    }

    public Boolean getRequired() {

        return required;
    }

    public void setRequired(Boolean required) {

        this.required = required;
    }

    public Boolean getSearchable() {

        return searchable;
    }

    public void setSearchable(Boolean searchable) {

        this.searchable = searchable;
    }

    public Boolean getFaceted() {

        return faceted;
    }

    public void setFaceted(Boolean faceted) {

        this.faceted = faceted;
    }

    public Boolean getShowInList() {

        return showInList;
    }

    public void setShowInList(Boolean showInList) {

        this.showInList = showInList;
    }

    public Map<Long, Object> getOptions() {

        return options;
    }

    public void setOptions(Map<Long, Object> options) {

        this.options = options;
    }

    public Integer getCurrentMinValue() {

        return currentMinValue;
    }

    public void setCurrentMinValue(Integer currentMinValue) {

        this.currentMinValue = currentMinValue;
    }

    public Integer getCurrentMaxValue() {

        return currentMaxValue;
    }

    public void setCurrentMaxValue(Integer currentMaxValue) {

        this.currentMaxValue = currentMaxValue;
    }

    public Integer getOrder() {

        return order;
    }

    public void setOrder(Integer order) {

        this.order = order;
    }
}

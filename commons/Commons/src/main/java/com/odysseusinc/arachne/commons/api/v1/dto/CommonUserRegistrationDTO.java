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

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

/**
 * Created by AKrutov on 20.10.2016.
 */
public class CommonUserRegistrationDTO {


    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    @Length.List({
            @Length(min = 2, message = "The firstname must be at least 2 characters"),
            @Length(max = 255, message = "The field must be less than 255 characters")
    })
    private String firstname;

    @Length(max = 255, message = "The field must be less than 255 characters")
    private String middlename;

    @NotBlank
    @Length.List({
            @Length(min = 2, message = "The lastname must be at least 2 characters"),
            @Length(max = 255, message = "The field must be less than 255 characters")
    })
    private String lastname;

    @NotNull(message = "{validation.professionalTypeId.NotNull}")
    private Long professionalTypeId;

    @Length(max = 50)
    private String uuid;

    private String registrantToken;

    private String callbackUrl;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getMiddlename() {
        return middlename;
    }

    public void setMiddlename(String middlename) {
        this.middlename = middlename;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Long getProfessionalTypeId() {
        return professionalTypeId;
    }

    public void setProfessionalTypeId(Long professionalTypeId) {
        this.professionalTypeId = professionalTypeId;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getRegistrantToken() {

        return registrantToken;
    }

    public void setRegistrantToken(String registrantToken) {

        this.registrantToken = registrantToken;
    }

    public String getCallbackUrl() {

        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {

        this.callbackUrl = callbackUrl;
    }
}

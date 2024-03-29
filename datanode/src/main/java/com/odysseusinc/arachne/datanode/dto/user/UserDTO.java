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

package com.odysseusinc.arachne.datanode.dto.user;

import java.util.List;

public class UserDTO {

    private String id;
    private String firstname;
    private String middlename;
    private String lastname;
    private String email;
    private String username;
    private List<String> roles;
    private Boolean enabled;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getEmail() {

        return email;
    }

    public void setEmail(String email) {

        this.email = email;
    }

    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {

        this.username = username;
    }

    public List<String> getRoles() {

        return roles;
    }

    public void setRoles(List<String> roles) {

        this.roles = roles;
    }

    public Boolean getEnabled() {

        return enabled;
    }

    public void setEnabled(Boolean enabled) {

        this.enabled = enabled;
    }
}

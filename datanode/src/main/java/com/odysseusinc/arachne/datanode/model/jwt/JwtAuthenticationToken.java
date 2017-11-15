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
 * Created: November 01, 2016
 *
 */

package com.odysseusinc.arachne.datanode.model.jwt;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;


public class JwtAuthenticationToken extends UsernamePasswordAuthenticationToken {


    private String token;


    public JwtAuthenticationToken(String token) {

        super(null, null);
        this.token = token;
    }

    public String getToken() {

        return token;
    }

    public void setToken(String token) {

        this.token = token;
    }

    @Override
    public Object getCredentials() {

        return null;
    }

    @Override
    public Object getPrincipal() {

        return null;
    }


}
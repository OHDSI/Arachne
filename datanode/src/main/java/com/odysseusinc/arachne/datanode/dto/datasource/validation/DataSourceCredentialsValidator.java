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

package com.odysseusinc.arachne.datanode.dto.datasource.validation;

import com.odysseusinc.arachne.datanode.dto.datasource.validation.context.CredentialsValidationContextBuilder;
import com.odysseusinc.arachne.datanode.model.datasource.DataSource;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

@Component
public class DataSourceCredentialsValidator extends BaseValidator implements ConstraintValidator<ValidCredentials, DataSource> {

    private static final String USERNAME_FIELDNAME = "username";
    private static final String KEYFILE_FIELDNAME = "keyfile";
    private static final String KRB_USER_FIELD = "krbUser";

    @Override
    public void initialize(ValidCredentials validCredentials) {
    }

    @Override
    public boolean isValid(DataSource datasource, ConstraintValidatorContext context) {

        return isValid(context, CredentialsValidationContextBuilder.newContextOfType(datasource.getType())
                .withUsername(USERNAME_FIELDNAME, datasource.getUsername())
                .usingKeyFile(true)
                .withKeyfile(KEYFILE_FIELDNAME, datasource.getKeyfile())
                .usingKerberos(datasource.getUseKerberos())
                .withKerberosAuthMechanism(datasource.getKrbAuthMechanism())
                .withKerberosUser(KRB_USER_FIELD, datasource.getKrbUser())
                .build());
    }
}

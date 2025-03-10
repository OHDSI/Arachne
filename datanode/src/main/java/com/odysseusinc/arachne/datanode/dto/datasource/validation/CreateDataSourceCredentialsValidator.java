/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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

import com.odysseusinc.arachne.commons.types.DBMSType;
import com.odysseusinc.arachne.datanode.dto.datasource.WriteDataSourceDTO;
import com.odysseusinc.arachne.datanode.dto.datasource.validation.context.CredentialsValidationContextBuilder;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import org.springframework.stereotype.Component;

@Component
public class CreateDataSourceCredentialsValidator extends BaseValidator implements ConstraintValidator<ValidCredentials, WriteDataSourceDTO> {

    @Override
    public boolean isValid(WriteDataSourceDTO writeDataSourceDTO, ConstraintValidatorContext context) {
        return isValid(context, CredentialsValidationContextBuilder.newContextOfType(DBMSType.valueOf(writeDataSourceDTO.getDbmsType()))
                .withUsername("dbUsername", writeDataSourceDTO.getDbUsername())
                .usingKeyFile(false)
                .usingKerberos(writeDataSourceDTO.getUseKerberos())
                .withKerberosAuthMechanism(writeDataSourceDTO.getKrbAuthMechanism())
                .withKerberosUser("krbUser", writeDataSourceDTO.getKrbUser())
                .build());
    }
}

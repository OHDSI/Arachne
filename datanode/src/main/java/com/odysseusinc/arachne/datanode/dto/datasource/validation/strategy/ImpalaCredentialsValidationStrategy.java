/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
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
 *******************************************************************************/

package com.odysseusinc.arachne.datanode.dto.datasource.validation.strategy;

import com.odysseusinc.arachne.datanode.dto.datasource.validation.context.CredentialsValidationContext;
import java.util.Objects;
import javax.validation.ConstraintValidatorContext;
import org.apache.commons.lang3.StringUtils;

public class ImpalaCredentialsValidationStrategy extends DefaultCredentialsValidationStrategy {
    @Override
    public boolean isValid(ConstraintValidatorContext context, CredentialsValidationContext validationContext) {

        if (validationContext.isUseKerberos()) {
            if (Objects.isNull(validationContext.getKerberosAuthMechanism())) {
                buildFieldConstraint(context, "kerberosAuthMechanism");
                return false;
            }
            switch (validationContext.getKerberosAuthMechanism()) {
                case KEYTAB:
                    return validateKeyfile(context, validationContext);
                case PASSWORD:
                    if (StringUtils.isBlank(validationContext.getKerberosUser())) {
                        buildFieldConstraint(context, validationContext.getKerberosUserField());
                        return false;
                    }
                    break;
            }
            return true;
        } else {
            return super.isValid(context, validationContext);
        }
    }

}

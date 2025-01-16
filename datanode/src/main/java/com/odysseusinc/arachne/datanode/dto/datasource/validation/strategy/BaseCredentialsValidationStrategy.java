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

package com.odysseusinc.arachne.datanode.dto.datasource.validation.strategy;

import com.odysseusinc.arachne.datanode.dto.datasource.validation.context.CredentialsValidationContext;

import java.util.Objects;
import jakarta.validation.ConstraintValidatorContext;

public abstract class BaseCredentialsValidationStrategy implements CredentialsValidationStrategy {

    protected void buildFieldConstraint(ConstraintValidatorContext context, String fieldName) {

        context.disableDefaultConstraintViolation();
        String tmpl = context.getDefaultConstraintMessageTemplate();
        context.buildConstraintViolationWithTemplate(tmpl)
                .addPropertyNode(fieldName)
                .addConstraintViolation();
    }

    protected boolean validateKeyfile(ConstraintValidatorContext context, CredentialsValidationContext validationContext) {

        if (validationContext.isUseKeyFile() && Objects.isNull(validationContext.getKeyfile())) {
            buildFieldConstraint(context, validationContext.getKeyfileField());
            return false;
        }
        return true;
    }
}

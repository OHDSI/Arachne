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
package com.odysseusinc.arachne.commons.api.v1.dto.util;

import org.apache.commons.beanutils.BeanUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.lang.reflect.InvocationTargetException;
import org.apache.commons.beanutils.NestedNullException;


public class NotNullIfAnotherFieldHasValueValidator implements ConstraintValidator<NotNullIfAnotherFieldHasValue,
        Object> {

    private String fieldName;
    private String expectedFieldValue;
    private String dependentFieldName;

    @Override
    public void initialize(final NotNullIfAnotherFieldHasValue annotation) {

        fieldName = annotation.fieldName();
        expectedFieldValue = annotation.fieldValue();
        dependentFieldName = annotation.dependentFieldName();
    }

    @Override
    public boolean isValid(final Object value, final ConstraintValidatorContext ctx) {
        if (value == null) {
            return true;
        }
        try {
            String fieldValue = getFieldValue(value);
            final String dependentFieldValue = BeanUtils.getProperty(value, dependentFieldName);
            if (expectedFieldValue.equals(fieldValue) && dependentFieldValue == null) {
                ctx.disableDefaultConstraintViolation();
                ctx.buildConstraintViolationWithTemplate(ctx.getDefaultConstraintMessageTemplate())
                        .addPropertyNode(dependentFieldName)
                        .addConstraintViolation();
                return false;
            }
            return true;
        } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            return false;
        }

    }

    private String getFieldValue(Object value) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
        try {
            return BeanUtils.getProperty(value, fieldName);
        } catch (NestedNullException e) {
            return null;
        }
    }
}

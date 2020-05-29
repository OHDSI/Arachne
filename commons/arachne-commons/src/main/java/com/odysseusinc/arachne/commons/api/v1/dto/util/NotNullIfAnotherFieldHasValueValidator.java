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

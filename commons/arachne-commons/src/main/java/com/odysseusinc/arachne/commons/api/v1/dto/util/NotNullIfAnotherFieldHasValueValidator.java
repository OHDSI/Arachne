package com.odysseusinc.arachne.commons.api.v1.dto.util;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType;
import org.apache.commons.beanutils.BeanUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.lang.reflect.InvocationTargetException;


public class NotNullIfAnotherFieldHasValueValidator implements ConstraintValidator<NotNullIfAnotherFieldHasValue,
        Object> {

    private String fieldName;
    private CommonModelType expectedFieldValue;
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
            final CommonModelType fieldValue = CommonModelType.valueOf(BeanUtils.getProperty(value, fieldName));
            final String dependentFieldValue = BeanUtils.getProperty(value, dependentFieldName);
            if (expectedFieldValue == fieldValue && dependentFieldValue == null) {
                ctx.disableDefaultConstraintViolation();
                ctx.buildConstraintViolationWithTemplate(ctx.getDefaultConstraintMessageTemplate())
                        .addNode(dependentFieldName)
                        .addConstraintViolation();
                return false;
            }
            return true;
        } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            return false;
        }

    }
}

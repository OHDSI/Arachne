package com.odysseusinc.arachne.commons.api.v1.dto.util;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Objects;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import org.apache.commons.lang3.StringUtils;

public class AnyFieldNotBlankValidator implements ConstraintValidator<AnyFieldNotBlank, Object> {

	private String[] fields;

	@Override
	public void initialize(AnyFieldNotBlank anyNotBlank) {

		this.fields = anyNotBlank.fields();
	}

	@Override
	public boolean isValid(Object dto, ConstraintValidatorContext constraintValidatorContext) {

		return Objects.nonNull(dto) && Arrays.stream(fields).anyMatch(f -> notBlank(f, dto));
	}

	private boolean notBlank(String field, Object dto) {

		try {
			Object value = getFieldValue(dto, field);
			return Objects.nonNull(value) && ((!(value instanceof CharSequence)) || StringUtils.isNotBlank((CharSequence) value));
		}catch (Exception e){
			return false;
		}
	}

	private Object getFieldValue(Object object, String fieldName) throws Exception {
		Class<?> clazz = object.getClass();
		Field passwordField = clazz.getDeclaredField(fieldName);
		passwordField.setAccessible(true);
		return passwordField.get(object);
	}
}

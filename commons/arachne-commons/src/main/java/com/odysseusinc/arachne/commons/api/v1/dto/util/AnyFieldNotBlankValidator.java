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
	public boolean isValid(Object dto, ConstraintValidatorContext context) {

		boolean result = Objects.nonNull(dto) && Arrays.stream(fields).anyMatch(f -> notBlank(f, dto));
		if (!result) {
			context.disableDefaultConstraintViolation();
			Arrays.stream(fields).forEach(f -> context
							.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
							.addPropertyNode(f)
							.addConstraintViolation());
		}
		return result;
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
		Field field = clazz.getDeclaredField(fieldName);
		field.setAccessible(true);
		return field.get(object);
	}
}

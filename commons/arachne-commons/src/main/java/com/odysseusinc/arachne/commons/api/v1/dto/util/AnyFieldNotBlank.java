package com.odysseusinc.arachne.commons.api.v1.dto.util;

import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;

/**
 * @author vkoulakov
 * @since 12/3/18.
 */
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AnyFieldNotBlankValidator.class)
@Repeatable(AnyFieldNotBlank.List.class)
public @interface AnyFieldNotBlank {
	String message() default "{org.hibernate.validator.constraints.NotBlank.message}";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
	String[] fields() default {"id", "name"};

	@Target({ ElementType.TYPE })
	@Retention(RetentionPolicy.RUNTIME)
	@interface List {
		AnyFieldNotBlank[] value();
	}
}

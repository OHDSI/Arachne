package com.odysseusinc.arachne.commons.api.v1.dto.util;

import com.odysseusinc.arachne.commons.api.v1.dto.CommonModelType;
import org.springframework.messaging.handler.annotation.Payload;

import javax.validation.Constraint;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Validates that field {@code dependentFieldName} is not null if field {@code fieldName} has value {@code fieldValue}.
 */
@Target({TYPE, ANNOTATION_TYPE})
@Retention(RUNTIME)
@Constraint(validatedBy = NotNullIfAnotherFieldHasValueValidator.class)
@Documented
public @interface NotNullIfAnotherFieldHasValue {

    String fieldName();

    String fieldValue();

    String dependentFieldName();

    String message() default "{javax.validation.constraints.NotNull.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    @Target({TYPE, ANNOTATION_TYPE})
    @Retention(RUNTIME)
    @Documented
    @interface List {
        NotNullIfAnotherFieldHasValue[] value();
    }
}
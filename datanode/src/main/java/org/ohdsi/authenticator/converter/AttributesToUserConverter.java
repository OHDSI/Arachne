/*
 * Copyright 2024 Odysseus Data Services, Inc.
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
package org.ohdsi.authenticator.converter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.ohdsi.authenticator.exception.AuthenticationException;
import org.ohdsi.authenticator.model.User;
import org.ohdsi.authenticator.service.authentication.config.AuthServiceConfig;
import org.ohdsi.authenticator.service.directory.ldap.UserMappingConfig;
import org.springframework.context.expression.MapAccessor;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.SpelEvaluationException;
import org.springframework.expression.spel.SpelMessage;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.util.CollectionUtils;

/**
 * This class overrides the original {@code AttributesToUserConverter} from the {@code org.ohdsi.authenticator.converter} package.
 * By placing it in the same package, the JVM prioritizes this implementation due to how classloading works in Java,
 * effectively replacing the library's version without directly modifying its source.
 * This is a quick WORKAROUND to customize behavior without changing the Authenticator library!.
 */
public class AttributesToUserConverter {

    public static final List<SpelMessage> FIELD_NOT_FOUND_MESSAGE_CODES = Arrays.asList(SpelMessage.PROPERTY_OR_FIELD_NOT_READABLE_ON_NULL, SpelMessage.PROPERTY_OR_FIELD_NOT_READABLE);
    private AuthServiceConfig config;

    public AttributesToUserConverter(AuthServiceConfig config) {

        this.config = config;
    }

    public User convert(Map<String, ? extends Object> attributesRawData) {

        return convert(null, attributesRawData);
    }

    public User convert(String username, Map<String, ? extends Object> attributesRawData) {

        SpringExpresionConverter expr = new SpringExpresionConverter(attributesRawData);

        UserMappingConfig fieldsToUser = config.getFieldsToExtract();

        if (fieldsToUser == null) {
            throw new AuthenticationException("There is no fieldsToExtract configuration property.");
        }

        return User.builder()
                .username(this.getUsername(expr, username, fieldsToUser))
                .email(value(expr, fieldsToUser.getEmail()))
                .firstName(value(expr, fieldsToUser.getFirstName()))
                .middleName(value(expr, fieldsToUser.getMiddleName()))
                .lastName(value(expr, fieldsToUser.getLastName()))
                .organization(value(expr, fieldsToUser.getOrganization()))
                .department(value(expr, fieldsToUser.getDepartment()))
                .affiliation(value(expr, fieldsToUser.getAffiliation()))
                .personalSummary(value(expr, fieldsToUser.getPersonalSummary()))
                .phone(value(expr, fieldsToUser.getPhone()))
                .mobile(value(expr, fieldsToUser.getPhone()))  // Assuming phone is both phone and mobile
                .address1(value(expr, fieldsToUser.getAddress1()))
                .city(value(expr, fieldsToUser.getCity()))
                .zipCode(value(expr, fieldsToUser.getZipCode()))
                .roles(this.getRoles(expr, fieldsToUser.getRoles(), fieldsToUser.getMemberOf()))
                .build();
    }

    private String value(SpringExpresionConverter expr, String expression) {
        try {
            return expr.getStringValue(expression);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String getUsername(SpringExpresionConverter expr, String username, UserMappingConfig fieldToUser) {

        if (StringUtils.isNotEmpty(username)) {
            return username;
        }
        return expr.getStringValue(fieldToUser.getUsername());
    }

    private List<String> getRoles(SpringExpresionConverter expr, Map<String, String> roles, String expression) {

        if (StringUtils.isEmpty(expression) || CollectionUtils.isEmpty(roles)) {
            return Collections.emptyList();
        }

        List<?> rolesFromAttributes = expr.getValue(expression, List.class);
        if (CollectionUtils.isEmpty(rolesFromAttributes)) {
            return Collections.emptyList();
        }
        return roles.entrySet().stream()
                .filter(e -> rolesFromAttributes.contains(e.getValue()))
                .map(e -> e.getKey())
                .collect(Collectors.toList());
    }

    public static class SpringExpresionConverter {
        private ExpressionParser parser;
        private StandardEvaluationContext context;

        public SpringExpresionConverter(Map<String, ? extends Object> attributesRawData) {

            this.parser = new SpelExpressionParser();
            this.context = new StandardEvaluationContext(attributesRawData);
            this.context.addPropertyAccessor(new MapAccessor());
        }

        public String getStringValue(String expression) {

            return getValue(expression, String.class);
        }

        public <T> T getValue(String expression, Class<T> clazz) {

            try {
                return parser.parseExpression(expression).getValue(context, clazz);
            } catch (SpelEvaluationException ex) {
                if (FIELD_NOT_FOUND_MESSAGE_CODES.contains(ex.getMessageCode())) {
                    return null;
                }
                throw ex;
            }
        }
    }

}
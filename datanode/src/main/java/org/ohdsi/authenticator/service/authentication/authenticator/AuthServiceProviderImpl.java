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
package org.ohdsi.authenticator.service.authentication.authenticator;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.ohdsi.authenticator.config.AuthSchema;
import org.ohdsi.authenticator.exception.AuthenticationException;
import org.ohdsi.authenticator.service.AuthMethodSettings;
import org.ohdsi.authenticator.service.AuthService;
import org.ohdsi.authenticator.service.authentication.AuthServiceProvider;
import org.ohdsi.authenticator.service.authentication.config.AuthServiceConfig;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * This class overrides the original {@code AttributesToUserConverter} from the {@code org.ohdsi.authenticator.converter} package.
 * By placing it in the same package, the JVM prioritizes this implementation due to how classloading works in Java,
 * effectively replacing the library's version without directly modifying its source.
 * This is a quick WORKAROUND to customize behavior without changing the Authenticator library!.
 */
public class AuthServiceProviderImpl implements AuthServiceProvider {

    private AuthSchema authSchema;
    private ObjectMapper objectMapper;

    private Map<String, AuthService> authServices = new HashMap<>();

    public AuthServiceProviderImpl(AuthSchema authSchema) {

        this.authSchema = authSchema;
    }

    @PostConstruct
    public void postConstruct()  {

        initObjectMapper();
        initServices();
    }

    @Override
    public Optional<AuthService> getByMethod(String method) {
        if (StringUtils.isEmpty(method)) {
            return Optional.empty();
        }

        return sanitizeAuthMethodName(method)
                .map(m -> authServices.get(m));

    }

    private void initServices(){

        try {
            for (Map.Entry<String, AuthMethodSettings> entry : authSchema.getMethods().entrySet()) {
                String method = entry.getKey();
                AuthMethodSettings authMethodSettings = entry.getValue();

                String authServiceClassName = authMethodSettings.getService();
                Class authServiceClass = ClassUtils.forName(authServiceClassName, this.getClass().getClassLoader());

                Class configClass = resolveRequiredConfigClass(authServiceClass);
                AuthServiceConfig config = resolveConfig(authMethodSettings.getConfig(), configClass);

                AuthService authService = constructAuthService(authServiceClass, config, method);
                sanitizeAuthMethodName(method)
                        .ifPresent(m -> authServices.put(m, authService));
            }
        } catch (Exception ex) {
            throw new AuthenticationException("Wrong configuration. Check 'authenticator.methonds' properties", ex);
        }
    }

    private void initObjectMapper() {

        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    private Class<? extends AuthServiceConfig> resolveRequiredConfigClass(Class authServiceClass) {

        Constructor[] constructors = authServiceClass.getDeclaredConstructors();
        for (Constructor constructor : constructors) {
            Class[] params = constructor.getParameterTypes();
            if (params.length == 2 && AuthServiceConfig.class.isAssignableFrom(params[0])) {
                return params[0];
            }
        }

        throw new RuntimeException(String.format("%s doesn't have required constructor", authServiceClass.getCanonicalName()));
    }

    private <T> T resolveConfig(Map rawConfig, Class targetType) {

        return (T) objectMapper.convertValue(rawConfig, targetType);
    }

    private AuthService constructAuthService(Class authServiceClass, AuthServiceConfig config, String method)
            throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {

        return (AuthService) authServiceClass
                .getDeclaredConstructor(config.getClass(), String.class)
                .newInstance(config, method);
    }


    private Optional<String> sanitizeAuthMethodName(String method) {

        if (StringUtils.isEmpty(method)) {
            return Optional.empty();
        }
        return Optional.of(method.toLowerCase().trim());
    }

}
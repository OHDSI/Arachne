/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: August 03, 2017
 *
 */

package com.odysseusinc.arachne.commons.service.preprocessor;

import com.odysseusinc.arachne.commons.annotations.PreprocessorComponent;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.context.ApplicationContext;
import org.springframework.util.StringUtils;


public class AnnotationPreprocessorRegistry<T> implements PreprocessorRegistry<T> {

    private static final Logger LOGGER = LoggerFactory.getLogger(AnnotationPreprocessorRegistry.class);
    private Map<String, Preprocessor<T>> preprocessorMap = new HashMap<>();
    private final ApplicationContext applicationContext;

    public AnnotationPreprocessorRegistry(ApplicationContext applicationContext) {

        this.applicationContext = applicationContext;
    }

    @PostConstruct
    public void init() {

        LOGGER.info("Initialize code generators");
        Map<String, Object> beans = applicationContext.getBeansWithAnnotation(PreprocessorComponent.class);
        beans.forEach((name, bean) -> {
            if (bean instanceof Preprocessor) {
                PreprocessorComponent annotation = bean.getClass().getAnnotation(PreprocessorComponent.class);
                if (annotation != null) {
                    if (!StringUtils.isEmpty(annotation.contentType())) {
                        register(annotation.contentType(), (Preprocessor<T>) bean);
                    } else {
                        for (String type : annotation.contentTypes()) {
                            register(type, (Preprocessor<T>) bean);
                        }
                    }
                    LOGGER.info("Registered code generator: {} for type: {}", name, annotation.contentType());
                }
            } else {
                String message = String.format("Bean %s does not implement CodeGenerator", name);
                LOGGER.warn(message);
                throw new BeanInitializationException(message);
            }
        });

    }

    @Override
    public void register(String mimeType, Preprocessor<T> preprocessor) {

        preprocessorMap.put(mimeType, preprocessor);
    }

    @Override
    public Preprocessor<T> getPreprocessor(String mimeType) {

        return preprocessorMap.getOrDefault(mimeType, new DefaultPreprocessor<>());
    }
}

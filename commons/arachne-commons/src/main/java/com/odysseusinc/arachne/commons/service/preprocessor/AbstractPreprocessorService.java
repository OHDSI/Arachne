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

import java.io.File;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.factory.BeanInitializationException;

public abstract class AbstractPreprocessorService<T> implements PreprocessorService<T> {

    private PreprocessorRegistry<T> preprocessorRegistry;

    public AbstractPreprocessorService() {

    }

    public AbstractPreprocessorService(PreprocessorRegistry<T> preprocessorRegistry) {

        this.preprocessorRegistry = preprocessorRegistry;
    }

    public void setPreprocessorRegistry(PreprocessorRegistry<T> preprocessorRegistry) {

        this.preprocessorRegistry = preprocessorRegistry;
    }

    protected PreprocessorRegistry<T> getPreprocessorRegistry() {

        return preprocessorRegistry;
    }

    protected boolean before(T analysis) {
        return true;
    }

    protected void after(T analysis) {
    }

    @Override
    public void runPreprocessor(T analysis) {
        if (Objects.isNull(preprocessorRegistry)) {
            throw new BeanInitializationException("preprocessorRegistry is required");
        }
        if (before(analysis)) {
            getFiles(analysis).forEach(file -> {
                getContentType(analysis, file).ifPresent(contentType -> {
                    preprocessorRegistry.getPreprocessor(contentType).preprocess(analysis, file);
                });
            });
        }
        after(analysis);
    }

    protected abstract List<File> getFiles(T analysis);

    protected abstract Optional<String> getContentType(T analysis, File file);
}

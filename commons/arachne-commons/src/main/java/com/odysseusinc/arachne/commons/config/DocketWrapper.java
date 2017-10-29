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
 * Created: November 02, 2016
 *
 */

package com.odysseusinc.arachne.commons.config;

import com.google.common.base.Predicate;
import com.google.common.base.Predicates;
import java.lang.annotation.Annotation;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;
import springfox.documentation.RequestHandler;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.SecurityScheme;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

public class DocketWrapper {

    private Docket docket;

    public DocketWrapper(Docket docket) {

        this.docket = docket;
    }

    public DocketWrapper(String title,
                         String description,
                         String version,
                         String license,
                         String tokenHeader,
                         Class<? extends Annotation> annotation,
                         String... packages) {


        final List<SecurityScheme> securitySchemes
                = Collections.singletonList(new ApiKey(tokenHeader, "api_key", "header"));

        final Predicate<RequestHandler> packagePredicate = Stream.of(packages)
                .map(RequestHandlerSelectors::basePackage)
                .reduce(Predicates::or)
                .orElse(x -> false);

        final Predicate<RequestHandler> annotationPredicate = RequestHandlerSelectors.withClassAnnotation(annotation);

        final Predicate<RequestHandler> selectorPredicate = Stream.of(packagePredicate, annotationPredicate)
                .reduce(Predicates::and)
                .orElse(x -> true);

        this.docket = new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(selectorPredicate)
                .paths(PathSelectors.any())
                .build()
                .apiInfo(new ApiInfoBuilder()
                        .title(title)
                        .license(license)
                        .description(description)
                        .version(version)
                        .build()
                )
                .securitySchemes(securitySchemes)
                .pathMapping("/")
                .useDefaultResponseMessages(false);
    }

    public Docket getDocket() {

        return docket;
    }
}

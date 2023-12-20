/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *        http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *******************************************************************************/
package com.odysseusinc.arachne.commons.utils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class AnnotationReflectionUtils {

  public static List<Method> getMethodsAnnotatedWith(final Class<?> type, final Class<? extends Annotation> annotation) {

    List<Method> methods = new ArrayList<>();
    Class<?> current = type;
    while (Objects.nonNull(current) && current != Object.class) {
      methods.addAll(Arrays.stream(current.getMethods())
              .filter(method -> method.isAnnotationPresent(annotation))
              .collect(Collectors.toList()));
      Arrays.stream(current.getInterfaces()).forEach(i -> methods.addAll(getMethodsAnnotatedWith(i, annotation)));
      current = current.getSuperclass();
    }
    return methods;
  }

}

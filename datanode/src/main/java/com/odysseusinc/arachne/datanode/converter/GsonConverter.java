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
package com.odysseusinc.arachne.datanode.converter;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import lombok.extern.slf4j.Slf4j;

import jakarta.persistence.AttributeConverter;
import java.lang.reflect.Type;

@Slf4j
public abstract class GsonConverter<T> implements AttributeConverter<T, String> {
    private static final Gson GSON = new Gson();

    private final Type type;

    public GsonConverter(TypeToken<T> type) {
        this.type = type.getType();
    }

    @Override
    public String convertToDatabaseColumn(T value) {
        return GSON.toJson(value, type);
    }

    @Override
    public T convertToEntityAttribute(String field) {
        return GSON.fromJson(field, type);
    }
}

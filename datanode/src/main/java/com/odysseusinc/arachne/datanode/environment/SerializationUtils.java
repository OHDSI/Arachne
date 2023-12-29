/*
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
 */
package com.odysseusinc.arachne.datanode.environment;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URL;
import java.util.function.Function;
import org.springframework.core.serializer.support.SerializationFailedException;

public class SerializationUtils {
    private final static ObjectMapper objectMapper = new ObjectMapper();

    public static String serialize(final Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new SerializationFailedException(e.getMessage(), e);
        }
    }

    public static <T> Function<String,T> deserialize(Class<T> deserializableClass) {
        return value -> {
            try {
                return objectMapper.readValue(value, deserializableClass);
            } catch (JsonProcessingException e) {
                throw new SerializationFailedException(e.getMessage(), e);
            }
        };
    }

    public static <T> Function<String,T> deserialize(TypeReference<T> deserializableClass) {
        return value -> {
            try {
                return objectMapper.readValue(value, deserializableClass);
            } catch (JsonProcessingException e) {
                throw new SerializationFailedException(e.getMessage(), e);
            }
        };
    }

    public static <T> Function<URL,T> deserializeByUrl(Class<T> deserializableClass) {
        return value -> {
            try {
                return objectMapper.readValue(value, deserializableClass);
            } catch (IOException e) {
                throw new SerializationFailedException(e.getMessage(), e);
            }
        };
    }

    public static JsonParser traverse(JsonNode jsonNode) throws IOException {
        JsonParser parser = jsonNode.traverse();
        parser.nextToken();
        return parser;
    }

}

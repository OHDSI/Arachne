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

package com.odysseusinc.arachne.datanode.controller;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Response structure to report multiple validation errors on a form.
 */
@Getter
@RequiredArgsConstructor(staticName = "of")
@AllArgsConstructor(staticName = "of")
public class ValidationErrors implements Serializable {
    private final String errorMessage;
    private Map<String, Object> validatorErrors = new HashMap<>();
}

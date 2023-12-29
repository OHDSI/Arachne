/*
 * Copyright 2020, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.model.datanode.validation;

import com.odysseusinc.arachne.datanode.model.datanode.DataNode;
import com.odysseusinc.arachne.datanode.service.DataNodeService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class DataNodeTokenValidator implements ConstraintValidator<NonEmptyToken, DataNode> {

    @Autowired
    private DataNodeService dataNodeService;

    @Override
    public void initialize(NonEmptyToken nonEmptyToken) {
    }

    @Override
    public boolean isValid(DataNode dataNode, ConstraintValidatorContext context) {
        return true;
    }
}

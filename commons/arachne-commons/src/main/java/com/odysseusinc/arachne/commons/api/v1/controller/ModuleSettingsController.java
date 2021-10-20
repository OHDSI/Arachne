/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Authors: Sergey Suvorov
 * Created: September 27, 2021
 *
 */

package com.odysseusinc.arachne.commons.api.v1.controller;

import com.odysseusinc.arachne.commons.api.v1.dto.util.JsonResult;
import com.odysseusinc.arachne.commons.config.ArachneConfiguration;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api
@RestController
public class ModuleSettingsController {
    private final ArachneConfiguration arachneConfiguration;

    public ModuleSettingsController(ArachneConfiguration arachneConfiguration) {
        this.arachneConfiguration = arachneConfiguration;        
    }

    @RequestMapping(value = "/api/v1/modules/disabled-modules", method = RequestMethod.GET)
    public JsonResult<List<String>> getDisabledModules() {
        JsonResult<List<String>> result = new JsonResult<>(JsonResult.ErrorCode.NO_ERROR);
        result.setResult(arachneConfiguration.getDisabledModules());
        return result;
    }
}

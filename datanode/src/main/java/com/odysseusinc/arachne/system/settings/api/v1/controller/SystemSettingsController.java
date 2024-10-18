/*
 * Copyright 2018, 2023 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.system.settings.api.v1.controller;

import com.odysseusinc.arachne.system.settings.api.v1.dto.SystemSettingsGroupListDTO;
import com.odysseusinc.arachne.system.settings.api.v1.dto.SystemSettingsListDTO;
import com.odysseusinc.arachne.system.settings.exception.NoSuchSystemSettingException;
import com.odysseusinc.arachne.system.settings.model.SystemSettingsGroup;
import com.odysseusinc.arachne.system.settings.service.SystemSettingsService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;

@Api(hidden = true)
@RestController
@Secured("ROLE_ADMIN")
public class SystemSettingsController {

    @Autowired
    private SystemSettingsService systemSettingsService;

    @RequestMapping(value = "/api/v1/admin/system-settings", method = RequestMethod.GET)
    public SystemSettingsGroupListDTO systemSettings() {

        SystemSettingsGroupListDTO dto = new SystemSettingsGroupListDTO();
        dto.setList(new LinkedList<>());
        for (SystemSettingsGroup systemSettingsGroup : systemSettingsService.getAll()) {
            dto.getList().add(systemSettingsService.toDto(systemSettingsGroup));
        }
        dto.setApplied(!systemSettingsService.isConfigChanged());
        return dto;
    }

    @RequestMapping(value = "/api/v1/admin/system-settings", method = RequestMethod.POST)
    public void saveSystemSettings(
            @RequestBody SystemSettingsListDTO systemSettingListDTO)
            throws NoSuchSystemSettingException, BindException {

        if (systemSettingListDTO != null) {
            systemSettingsService.saveSystemSetting(systemSettingListDTO.getValues());
        }
    }


}

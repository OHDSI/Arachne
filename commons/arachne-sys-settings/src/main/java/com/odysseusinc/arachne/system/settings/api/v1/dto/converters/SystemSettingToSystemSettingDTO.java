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
 * Authors: Pavel Grafkin, Alexandr Ryabokon
 * Created: April 19, 2017
 *
 */

package com.odysseusinc.arachne.system.settings.api.v1.dto.converters;

import com.odysseusinc.arachne.system.settings.api.v1.dto.SystemSettingDTO;
import com.odysseusinc.arachne.system.settings.model.SystemSetting;
import com.odysseusinc.arachne.system.settings.service.SystemSettingsService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.stereotype.Component;

@Component
public class SystemSettingToSystemSettingDTO implements Converter<SystemSetting, SystemSettingDTO>, InitializingBean {

    @Autowired
    private GenericConversionService conversionService;

    @Autowired
    private ConfigurableEnvironment env;

    @Autowired
    private SystemSettingsService systemSettingsService;

    @Override
    public void afterPropertiesSet() throws Exception {

        conversionService.addConverter(this);
    }

    @Override
    public SystemSettingDTO convert(SystemSetting systemSetting) {

        SystemSettingDTO dto = new SystemSettingDTO();
        dto.setId(systemSetting.getId());
        dto.setLabel(systemSetting.getLabel());
        dto.setName(systemSetting.getName());
        dto.setType(systemSetting.getType().toString());
        if (!systemSettingsService.isSecuredSetting(systemSetting)) {
            if (systemSetting.getValue() != null) {
                String value = systemSettingsService.getDecryptedValue(systemSetting.getValue());
                dto.setValue(value);
            } else if (env.containsProperty(systemSetting.getName())) {
                dto.setValue(env.getProperty(systemSetting.getName()));
            }
        } else {
            dto.setIsSet(systemSetting.getValue() != null || env.containsProperty(systemSetting.getName()));
        }
        /*
        // Get not decrypted props
        else {
            String value = null;

            MutablePropertySources mutablePropertySources = env.getPropertySources();
            Iterator iterator = mutablePropertySources.iterator();

            while (iterator.hasNext()) {
                PropertySource<?> ps = (PropertySource) iterator.next();
                PropertySource<?> original = ps instanceof EncryptablePropertySource ? ((EncryptablePropertySource)ps).getDelegate() : ps;

                value = (String) original.getProperty(systemSetting.getName());

                if (value != null) break;
            }

            dto.setValue(value);
        }*/
        return dto;
    }
}
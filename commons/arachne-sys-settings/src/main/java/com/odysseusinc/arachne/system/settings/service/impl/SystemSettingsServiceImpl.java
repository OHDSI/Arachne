/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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

package com.odysseusinc.arachne.system.settings.service.impl;

import static org.apache.commons.lang3.StringUtils.split;

import com.google.common.collect.Lists;
import com.odysseusinc.arachne.system.settings.exception.NoSuchSystemSettingException;
import com.odysseusinc.arachne.system.settings.model.SystemSetting;
import com.odysseusinc.arachne.system.settings.model.SystemSettingType;
import com.odysseusinc.arachne.system.settings.model.SystemSettingsGroup;
import com.odysseusinc.arachne.system.settings.repository.SystemSettingRepository;
import com.odysseusinc.arachne.system.settings.repository.SystemSettingsGroupRepository;
import com.odysseusinc.arachne.system.settings.service.SystemSettingsService;
import com.ulisesbocchio.jasyptspringboot.EncryptablePropertyResolver;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import javax.xml.bind.ValidationException;
import org.jasypt.encryption.StringEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.AntPathMatcher;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;

@Service
@Transactional
public class SystemSettingsServiceImpl implements SystemSettingsService {

    private static String encryptedPrefix = "ENC(";
    private static String encryptedSuffix = ")";

    private boolean isConfigChanged;

    @Autowired
    private StringEncryptor stringEncryptor;

    @Autowired
    private EncryptablePropertyResolver encryptablePropertyResolver;

    @Autowired
    private Environment environment;

    @Autowired
    private SystemSettingsGroupRepository systemSettingsGroupRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Override
    public Iterable<SystemSettingsGroup> getAll() {

        return systemSettingsGroupRepository.findAll();
    }

    @Override
    public String getDecryptedValue(String value) {

        return encryptablePropertyResolver.resolvePropertyValue(value);
    }

    @Override
    public String getEncryptedValue(String value) {

        return encryptedPrefix + stringEncryptor.encrypt(value) + encryptedSuffix;
    }

    @Override
    public void saveSystemSetting(Map<Long, String> values) throws NoSuchSystemSettingException, BindException {

        if (values != null) {
            List<SystemSetting> forUpdate = new LinkedList<>();
            for (Map.Entry<Long, String> entry : values.entrySet()) {
                if (entry.getValue() != null) {
                    SystemSetting systemProperty = systemSettingRepository.findOne(entry.getKey());
                    if (systemProperty != null) {
                        if (systemProperty.getType() == SystemSettingType.checkbox) {
                            entry.setValue(String.valueOf(Boolean.parseBoolean(entry.getValue())));
                        }
                        String property = environment.getProperty(systemProperty.getName());
                        if (Objects.equals(property, entry.getValue())) {
                            if (systemProperty.getValue() != null) {
                                entry.setValue(null);
                                updateProperty(forUpdate, entry, systemProperty);
                            }
                        } else {
                            if (!Objects.equals(systemProperty.getValue(), entry.getValue())) {
                                updateProperty(forUpdate, entry, systemProperty);
                            }
                        }
                    }
                }
            }
            if (!forUpdate.isEmpty()) {
                systemSettingRepository.save(forUpdate);
                isConfigChanged = true;
            }
        } else {
            throw new NoSuchSystemSettingException();
        }
    }

    @Override
    public boolean isSecuredSetting(SystemSetting systemSetting) {

        return systemSetting.getType() == SystemSettingType.password;
    }

    private void updateProperty(List<SystemSetting> forUpdate, Map.Entry<Long, String> entry,
                                SystemSetting systemProperty) throws BindException {

        String value = entry.getValue();
        if (value != null) {
            if (isSecuredSetting(systemProperty)) {
                value = getEncryptedValue(value);
            }
            if (systemProperty.getType() == SystemSettingType.patterns) {
                checkPatterns(entry.getValue(), systemProperty.getId());
            }
        }
        systemProperty.setValue(value);
        forUpdate.add(systemProperty);
    }

    private void checkPatterns(String newValue, Long systemPropertyId) throws BindException {

        List<String> patterns = Lists.newArrayList(split(newValue, ","));
        AntPathMatcher antPathMatcher = new AntPathMatcher();
        boolean allValid = patterns.stream().allMatch(antPathMatcher::isPattern);

        if (!allValid) {
            BindException bindException = new BindException(systemPropertyId, "invalid pattern");
            bindException.addError(new FieldError(String.valueOf(systemPropertyId), String.valueOf(systemPropertyId),
                    "Invalid pattern. Please use * or ?"));
            throw bindException;
        }
    }

    @Override
    public boolean isConfigChanged() {

        return isConfigChanged;
    }
}

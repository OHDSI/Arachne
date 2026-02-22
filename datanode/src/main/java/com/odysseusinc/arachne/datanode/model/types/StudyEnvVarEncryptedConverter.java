/*
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

package com.odysseusinc.arachne.datanode.model.types;

import com.odysseusinc.arachne.datanode.config.DataSourceEncryptionProperties;
import com.odysseusinc.arachne.datanode.util.Fn;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.stereotype.Component;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jasypt.encryption.pbe.PBEStringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

/**
 * Encrypts/decrypts study environment variable values at rest using the same
 * jasypt.encryptor configuration as datasource passwords.
 */
@Component
@Converter(autoApply = false)
public class StudyEnvVarEncryptedConverter implements AttributeConverter<String, String> {

    private static final String ENC_PREFIX = "ENC(";
    private static final String ENC_SUFFIX = ")";

    private final PBEStringEncryptor encryptor;

    public StudyEnvVarEncryptedConverter(DataSourceEncryptionProperties encryptionProperties) {
        if (encryptionProperties.getPassword() == null || encryptionProperties.getAlgorithm() == null) {
            throw new IllegalStateException(
                    "Study env encryption requires jasypt.encryptor.password and jasypt.encryptor.algorithm (same as datasource encryption).");
        }
        this.encryptor = Fn.create(StandardPBEStringEncryptor::new, encryptor -> {
            encryptor.setProvider(new BouncyCastleProvider());
            encryptor.setProviderName("BC");
            encryptor.setKeyObtentionIterations(1000);
            encryptor.setAlgorithm(encryptionProperties.getAlgorithm());
            encryptor.setPassword(encryptionProperties.getPassword());
        });
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        return (attribute == null) ? null : ENC_PREFIX + encryptor.encrypt(attribute) + ENC_SUFFIX;
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        if (dbData.startsWith(ENC_PREFIX) && dbData.endsWith(ENC_SUFFIX)) {
            return encryptor.decrypt(dbData.substring(ENC_PREFIX.length(), dbData.length() - ENC_SUFFIX.length()));
        }
        return dbData;
    }
}

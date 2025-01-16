/*
 * Copyright 2018, 2025 Odysseus Data Services, Inc.
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

package com.odysseusinc.arachne.datanode.model.types;

import com.odysseusinc.arachne.datanode.config.DataSourceEncryptionProperties;
import com.odysseusinc.arachne.datanode.util.Fn;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jasypt.encryption.pbe.PBEStringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class DataSourcePasswordEncryptedConverter implements AttributeConverter<String, String> {

    private static final String ENC_PREFIX = "ENC(";
    private static final String ENC_SUFFIX = ")";

    private final PBEStringEncryptor encryptor;

    public DataSourcePasswordEncryptedConverter(DataSourceEncryptionProperties encryptionProperties) {
        if (encryptionProperties.getPassword() == null || encryptionProperties.getAlgorithm() == null) {
            throw new IllegalStateException("Data source encryption password or algorithm is not configured.");
        }

        // This encryptor is specifically used for encrypting/decrypting datasource passwords.
        // It is configured separately (not as a bean) to avoid conflicts with other general Jasypt encryptor beans.
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
        if (dbData != null && dbData.startsWith(ENC_PREFIX) && dbData.endsWith(ENC_SUFFIX)) {
            return encryptor.decrypt(dbData.substring(ENC_PREFIX.length(), dbData.length() - ENC_SUFFIX.length()));
        }
        return dbData;
    }
}
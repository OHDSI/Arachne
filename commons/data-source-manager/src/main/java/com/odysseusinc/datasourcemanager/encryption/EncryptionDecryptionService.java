package com.odysseusinc.datasourcemanager.encryption;

import java.util.Objects;
import org.jasypt.encryption.StringEncryptor;

public class EncryptionDecryptionService {

	public static final String PREFIX = "ENC(";
	public static final String SUFFIX = ")";

	private final StringEncryptor encryptor;

	public EncryptionDecryptionService(StringEncryptor encryptor) {

		this.encryptor = encryptor;
	}

	public String decrypt(String value) {

		String result = value;
		if (Objects.nonNull(value) && Objects.nonNull(encryptor) && value.startsWith(PREFIX)) {
			String encryptedData = value.substring(PREFIX.length(), value.length() - SUFFIX.length());
			result = encryptor.decrypt(encryptedData);
		}
		return result;
	}

	public String encrypt(String value) {

		String result = value;
		if (Objects.nonNull(value) && Objects.nonNull(encryptor)) {
			result = PREFIX + encryptor.encrypt(value) + SUFFIX;
		}
		return result;
	}
}

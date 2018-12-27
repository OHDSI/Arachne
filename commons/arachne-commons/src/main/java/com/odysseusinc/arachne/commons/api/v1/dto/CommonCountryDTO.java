package com.odysseusinc.arachne.commons.api.v1.dto;

import org.hibernate.validator.constraints.NotBlank;

public class CommonCountryDTO {
	private String name;

	@NotBlank
	private String isoCode;

	public String getName() {

		return name;
	}

	public void setName(String name) {

		this.name = name;
	}

	public String getIsoCode() {

		return isoCode;
	}

	public void setIsoCode(String isoCode) {

		this.isoCode = isoCode;
	}
}

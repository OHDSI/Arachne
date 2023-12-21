/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
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
 *******************************************************************************/
package com.odysseusinc.arachne.commons.api.v1.dto;

import org.hibernate.validator.constraints.NotBlank;

public class CommonStateProvinceDTO {
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

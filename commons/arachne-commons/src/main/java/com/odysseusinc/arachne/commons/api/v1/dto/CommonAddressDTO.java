package com.odysseusinc.arachne.commons.api.v1.dto;

import com.odysseusinc.arachne.commons.api.v1.dto.util.AnyFieldNotBlank;
import com.odysseusinc.arachne.commons.api.v1.dto.util.NotNullIfAnotherFieldHasValue;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

@AnyFieldNotBlank(fields = {"address1", "address2"}, message = "May not be empty")
@NotNullIfAnotherFieldHasValue(fieldName = "country.isoCode", fieldValue = "US", dependentFieldName = "stateProvince", message = "May not be empty")
public class CommonAddressDTO {
	private static final String MAY_NOT_BE_EMPTY = "May not be empty";
	private String phone;
	private String mobile;
	private String address1;
	private String address2;
	@NotBlank
	private String city;
	@NotBlank
	private String zipCode;
	@NotNull(message = MAY_NOT_BE_EMPTY)
	@Valid
	private CommonCountryDTO country;
	@Valid
	private CommonStateProvinceDTO stateProvince;
	@Email(message = "Email is not in the correct format")
	private String contactEmail;

	public String getPhone() {

		return phone;
	}

	public void setPhone(String phone) {

		this.phone = phone;
	}

	public String getMobile() {

		return mobile;
	}

	public void setMobile(String mobile) {

		this.mobile = mobile;
	}

	public String getAddress1() {

		return address1;
	}

	public void setAddress1(String address1) {

		this.address1 = address1;
	}

	public String getAddress2() {

		return address2;
	}

	public void setAddress2(String address2) {

		this.address2 = address2;
	}

	public String getCity() {

		return city;
	}

	public void setCity(String city) {

		this.city = city;
	}

	public CommonStateProvinceDTO getStateProvince() {

		return stateProvince;
	}

	public void setStateProvince(CommonStateProvinceDTO stateProvince) {

		this.stateProvince = stateProvince;
	}

	public String getZipCode() {

		return zipCode;
	}

	public void setZipCode(String zipCode) {

		this.zipCode = zipCode;
	}

	public CommonCountryDTO getCountry() {

		return country;
	}

	public void setCountry(CommonCountryDTO country) {

		this.country = country;
	}

	public String getContactEmail() {

		return contactEmail;
	}

	public void setContactEmail(String contactEmail) {

		this.contactEmail = contactEmail;
	}
}

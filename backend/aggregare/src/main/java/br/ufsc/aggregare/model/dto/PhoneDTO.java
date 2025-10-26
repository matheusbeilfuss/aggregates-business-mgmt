package br.ufsc.aggregare.model.dto;

import br.ufsc.aggregare.model.Phone;
import br.ufsc.aggregare.model.enums.PhoneTypeEnum;

public class PhoneDTO {

	private String number;
	private PhoneTypeEnum type;

	public PhoneDTO() {
	}

	public PhoneDTO(String number, PhoneTypeEnum type) {
		this.number = number;
		this.type = type;
	}

	public PhoneDTO(Phone phone) {
		this.number = phone.getNumber();
		this.type = phone.getType();
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public PhoneTypeEnum getType() {
		return type;
	}

	public void setType(PhoneTypeEnum type) {
		this.type = type;
	}
}

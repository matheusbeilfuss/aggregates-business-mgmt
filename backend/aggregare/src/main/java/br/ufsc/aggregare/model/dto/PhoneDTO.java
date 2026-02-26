package br.ufsc.aggregare.model.dto;

import br.ufsc.aggregare.model.Phone;
import br.ufsc.aggregare.model.enums.PhoneTypeEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PhoneDTO {

	private Long id;

	@NotBlank(message = "O número de telefone é obrigatório.")
	private String number;

	@NotNull(message = "O tipo de telefone é obrigatório.")
	private PhoneTypeEnum type;

	public PhoneDTO() {
	}

	public PhoneDTO(Long id, String number, PhoneTypeEnum type) {
		this.id = id;
		this.number = number;
		this.type = type;
	}

	public PhoneDTO(Phone phone) {
		this.id = phone.getId();
		this.number = phone.getNumber();
		this.type = phone.getType();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

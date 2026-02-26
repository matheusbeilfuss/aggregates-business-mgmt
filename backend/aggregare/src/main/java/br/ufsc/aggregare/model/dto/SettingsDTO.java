package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotBlank;

public class SettingsDTO {

	@NotBlank(message = "O nome do comércio é obrigatório.")
	private String businessName;

	public SettingsDTO() {
	}

	public SettingsDTO(String businessName) {
		this.businessName = businessName;
	}

	public String getBusinessName() {
		return businessName;
	}
	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}
}

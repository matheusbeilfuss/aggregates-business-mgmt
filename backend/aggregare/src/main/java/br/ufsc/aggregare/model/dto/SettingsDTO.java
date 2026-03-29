package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotBlank;

public class SettingsDTO {

	@NotBlank(message = "O nome do comércio é obrigatório.")
	private String businessName;

	private String businessImgName;

	public SettingsDTO() {
	}

	public SettingsDTO(String businessName, String businessImgName) {
		this.businessName = businessName;
		this.businessImgName = businessImgName;
	}

	public String getBusinessName() {
		return businessName;
	}

	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}

	public String getBusinessImgName() {
		return businessImgName;
	}

	public void setBusinessImgName(String businessImgName) {
		this.businessImgName = businessImgName;
	}
}

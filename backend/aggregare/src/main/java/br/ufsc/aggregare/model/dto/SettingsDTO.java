package br.ufsc.aggregare.model.dto;

public class SettingsDTO {

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

package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PasswordUpdateDTO {

	@NotBlank(message = "A nova senha é obrigatória.")
	@Size(min = 6, message = "A nova senha deve ter pelo menos 6 caracteres.")
	private String newPassword;

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
}

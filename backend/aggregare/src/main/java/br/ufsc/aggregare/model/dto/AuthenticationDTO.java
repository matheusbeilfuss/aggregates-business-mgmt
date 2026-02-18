package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationDTO(
		@NotBlank(message = "O nome de usuário é obrigatório.")
		String username,

		@NotBlank(message = "A senha é obrigatória.")
		String password
) {
}

package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserInsertDTO {

	@NotBlank(message = "O primeiro nome é obrigatório.")
	private String firstName;

	@NotBlank(message = "O sobrenome é obrigatório.")
	private String lastName;

	@NotBlank(message = "O nome de usuário é obrigatório.")
	private String username;

	@NotBlank(message = "O email é obrigatório.")
	@Email(message = "O email informado é inválido.")
	private String email;

	@NotBlank(message = "A senha é obrigatória.")
	@Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.")
	private String password;

	private Boolean admin;

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Boolean getAdmin() {
		return admin;
	}

	public void setAdmin(Boolean admin) {
		this.admin = admin;
	}
}

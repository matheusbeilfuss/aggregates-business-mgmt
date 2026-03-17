package br.ufsc.aggregare.model.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class ClientInputDTO {

	@NotBlank(message = "O nome do cliente é obrigatório.")
	private String name;

	private String cpfCnpj;
	private String email;

	@NotEmpty(message = "O cliente deve ter pelo menos um telefone.")
	@Valid
	private List<PhoneDTO> phones = new ArrayList<>();

	@NotBlank(message = "A rua é obrigatória.")
	private String street;

	@NotBlank(message = "O número é obrigatório.")
	private String number;

	private String complement;

	@NotBlank(message = "O bairro é obrigatório.")
	private String neighborhood;

	@NotBlank(message = "A cidade é obrigatória.")
	private String city;

	@NotBlank(message = "O estado é obrigatório.")
	@Size(min = 2, message = "O estado deve ter pelo menos 2 caracteres.")
	private String state;

	private String cep;

	public ClientInputDTO() {
	}

	public ClientInputDTO(String name, String cpfCnpj, String email, List<PhoneDTO> phones, String street, String number, String complement, String neighborhood, String city,
			String state, String cep) {
		this.name = name;
		this.cpfCnpj = cpfCnpj;
		this.email = email;
		this.phones = phones;
		this.street = street;
		this.number = number;
		this.complement = complement;
		this.neighborhood = neighborhood;
		this.city = city;
		this.state = state;
		this.cep = cep;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCpfCnpj() {
		return cpfCnpj;
	}

	public void setCpfCnpj(String cpfCnpj) {
		this.cpfCnpj = cpfCnpj;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<PhoneDTO> getPhones() {
		return phones;
	}

	public void setPhones(List<PhoneDTO> phones) {
		this.phones = phones;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getComplement() {
		return complement;
	}

	public void setComplement(String complement) {
		this.complement = complement;
	}

	public String getNeighborhood() {
		return neighborhood;
	}

	public void setNeighborhood(String neighborhood) {
		this.neighborhood = neighborhood;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}
}

package br.ufsc.aggregare.model.dto;

import java.util.ArrayList;
import java.util.List;

public class ClientInputDTO {

	private String name;
	private String cpfCnpj;
	private String email;

	private List<PhoneDTO> phones = new ArrayList<>();

	private String state;
	private String city;
	private String neighborhood;
	private String street;
	private String number;

	public ClientInputDTO() {
	}

	public ClientInputDTO(String name, String cpfCnpj, String email, List<PhoneDTO> phones, String state, String city, String neighborhood, String street, String number) {
		this.name = name;
		this.cpfCnpj = cpfCnpj;
		this.email = email;
		this.phones = phones;
		this.state = state;
		this.city = city;
		this.neighborhood = neighborhood;
		this.street = street;
		this.number = number;
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

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getNeighborhood() {
		return neighborhood;
	}

	public void setNeighborhood(String neighborhood) {
		this.neighborhood = neighborhood;
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
}

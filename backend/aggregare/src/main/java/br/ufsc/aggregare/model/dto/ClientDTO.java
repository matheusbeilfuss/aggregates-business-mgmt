package br.ufsc.aggregare.model.dto;

import java.util.List;

import br.ufsc.aggregare.model.Address;
import br.ufsc.aggregare.model.Client;
import br.ufsc.aggregare.model.Phone;

public class ClientDTO {

	private Long id;
	private String name;
	private String cpfCnpj;
	private String email;

	private String cep;
	private String state;
	private String city;
	private String neighborhood;
	private String street;
	private String number;
	private String complement;

	private List<PhoneDTO> phones;

	public ClientDTO() {
	}

	public ClientDTO(Client client, Address address, List<Phone> phones) {
		this.id = client.getId();
		this.name = client.getName();
		this.cpfCnpj = client.getCpfCnpj();
		this.email = client.getEmail();
		this.cep = address.getCep();
		this.state = address.getState();
		this.city = address.getCity();
		this.neighborhood = address.getNeighborhood();
		this.street = address.getStreet();
		this.number = address.getNumber();
		this.complement = address.getComplement();
		this.phones = phones.stream().map(PhoneDTO::new).toList();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
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

	public String getComplement() {
		return complement;
	}

	public void setComplement(String complement) {
		this.complement = complement;
	}

	public List<PhoneDTO> getPhones() {
		return phones;
	}

	public void setPhones(List<PhoneDTO> phones) {
		this.phones = phones;
	}
}

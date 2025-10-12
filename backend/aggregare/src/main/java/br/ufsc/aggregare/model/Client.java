package br.ufsc.aggregare.model;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_client")
public class Client implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String cpfCnpj;
	private String email;

	public Client() {
	}

	public Client(Long id, String name, String cpfCnpj, String email) {
		this.id = id;
		this.name = name;
		this.cpfCnpj = cpfCnpj;
		this.email = email;
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

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		Client client = (Client) o;
		return Objects.equals(id, client.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

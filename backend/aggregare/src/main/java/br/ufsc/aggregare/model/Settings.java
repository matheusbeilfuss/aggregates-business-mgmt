package br.ufsc.aggregare.model;

import java.io.Serial;
import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_settings")
public class Settings implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	private Long id = 1L;

	private String businessName;

	public Settings() {
	}

	public Settings(String businessName) {
		this.businessName = businessName;
	}

	public Long getId() {
		return id;
	}

	public String getBusinessName() {
		return businessName;
	}

	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}
}

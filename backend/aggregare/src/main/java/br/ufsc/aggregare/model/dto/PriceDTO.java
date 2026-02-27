package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PriceDTO {

	private Long id;

	@NotNull(message = "O volume em m³ é obrigatório.")
	@Positive(message = "O volume em m³ deve ser maior que zero.")
	private Integer m3Volume;

	@NotNull(message = "O preço é obrigatório.")
	@Positive(message = "O preço deve ser maior que zero.")
	private Double price;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getM3Volume() {
		return m3Volume;
	}

	public void setM3Volume(Integer m3Volume) {
		this.m3Volume = m3Volume;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
}

package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class StockUpdateDTO {

	@PositiveOrZero(message = "A quantidade em toneladas não pode ser negativa.")
	private Double tonQuantity;

	@PositiveOrZero(message = "A quantidade em m³ não pode ser negativa.")
	private Double m3Quantity;

	@PositiveOrZero(message = "A densidade não pode ser negativa.")
	private Double density;

	@NotNull(message = "O produto é obrigatório.")
	private Long productId;

	public StockUpdateDTO() {
	}

	public StockUpdateDTO(Double tonQuantity, Double m3Quantity, Double density, Long productId) {
		this.tonQuantity = tonQuantity;
		this.m3Quantity = m3Quantity;
		this.density = density;
		this.productId = productId;
	}

	public Double getTonQuantity() {
		return tonQuantity;
	}

	public void setTonQuantity(Double tonQuantity) {
		this.tonQuantity = tonQuantity;
	}

	public Double getM3Quantity() {
		return m3Quantity;
	}

	public void setM3Quantity(Double m3Quantity) {
		this.m3Quantity = m3Quantity;
	}

	public Double getDensity() {
		return density;
	}

	public void setDensity(Double density) {
		this.density = density;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}
}

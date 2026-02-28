package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProductSupplierUpdateDTO {

	@NotNull(message = "O produto é obrigatório.")
	private Long productId;

	@Positive(message = "O custo por tonelada deve ser maior que zero.")
	private Double tonCost;

	@Positive(message = "O custo por m³ deve ser maior que zero.")
	private Double costPerCubicMeter;

	@Positive(message = "O custo por 5m³ deve ser maior que zero.")
	private Double costFor5CubicMeters;

	@Positive(message = "A densidade deve ser maior que zero.")
	private Double density;

	private String observations;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Double getTonCost() {
		return tonCost;
	}

	public void setTonCost(Double tonCost) {
		this.tonCost = tonCost;
	}

	public Double getCostPerCubicMeter() {
		return costPerCubicMeter;
	}

	public void setCostPerCubicMeter(Double costPerCubicMeter) {
		this.costPerCubicMeter = costPerCubicMeter;
	}

	public Double getCostFor5CubicMeters() {
		return costFor5CubicMeters;
	}

	public void setCostFor5CubicMeters(Double costFor5CubicMeters) {
		this.costFor5CubicMeters = costFor5CubicMeters;
	}

	public Double getDensity() {
		return density;
	}

	public void setDensity(Double density) {
		this.density = density;
	}

	public String getObservations() {
		return observations;
	}

	public void setObservations(String observations) {
		this.observations = observations;
	}
}

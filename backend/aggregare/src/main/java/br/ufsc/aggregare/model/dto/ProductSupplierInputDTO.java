package br.ufsc.aggregare.model.dto;

public class ProductSupplierInputDTO {
	private Long productId;
	private Long supplierId;
	private Double tonCost;
	private Double costPerCubicMeter;
	private Double costFor5CubicMeters;
	private Double density;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Long getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(Long supplierId) {
		this.supplierId = supplierId;
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
}

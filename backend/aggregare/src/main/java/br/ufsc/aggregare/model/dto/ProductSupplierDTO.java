package br.ufsc.aggregare.model.dto;

public class ProductSupplierDTO {
	private Long id;
	private Long supplierId;
	private String supplierName;
	private Double tonCost;
	private Double costPerCubicMeter;
	private Double costFor5CubicMeters;
	private Double density;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(Long supplierId) {
		this.supplierId = supplierId;
	}

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
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

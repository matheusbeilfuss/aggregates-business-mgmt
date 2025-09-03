package br.ufsc.aggregare.model.dto;

import br.ufsc.aggregare.model.Supplier;

public record SupplierDTO(Long id,
						  String name,
						  String material,
						  Double density,
						  Double costPerTon,
						  Double costPerCubicMeter,
						  Double profitPerCubicMeter,
						  Double costFor5CubicMeters,
						  Double profitFor5CubicMeters) {

	public SupplierDTO(Supplier supplier, Double profitPerCubicMeter, Double profitFor5CubicMeters) {
		this(
				supplier.getId(),
				supplier.getName(),
				supplier.getMaterial(),
				supplier.getDensity(),
				supplier.getCostPerTon(),
				supplier.getCostPerCubicMeter(),
				profitPerCubicMeter,
				supplier.getCostFor5CubicMeters(),
				profitFor5CubicMeters
		);
	}
}

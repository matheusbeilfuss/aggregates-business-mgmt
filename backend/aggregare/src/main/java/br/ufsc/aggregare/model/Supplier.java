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
@Table(name = "tb_supplier")
public class Supplier implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String material;
	private Double costPerCubicMeter;
	private Double costFor5CubicMeters;
	private Double costPerTon;
	private Double density;

	public Supplier() {
	}

	public Supplier(Long id, String material, String name, Double costPerCubicMeter, Double costFor5CubicMeters, Double costPerTon, Double density) {
		this.id = id;
		this.material = material;
		this.name = name;
		this.costPerCubicMeter = costPerCubicMeter;
		this.costFor5CubicMeters = costFor5CubicMeters;
		this.costPerTon = costPerTon;
		this.density = density;
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

	public String getMaterial() {
		return material;
	}

	public void setMaterial(String material) {
		this.material = material;
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

	public Double getCostPerTon() {
		return costPerTon;
	}

	public void setCostPerTon(Double costPerTon) {
		this.costPerTon = costPerTon;
	}

	public Double getDensity() {
		return density;
	}

	public void setDensity(Double density) {
		this.density = density;
	}

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		Supplier supplier = (Supplier) o;
		return Objects.equals(id, supplier.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

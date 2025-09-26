package br.ufsc.aggregare.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_product_supplier")
public class ProductSupplier implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "product_id")
	private Product product;

	@ManyToOne
	@JoinColumn(name = "supplier_id")
	private Supplier supplier;

	private Double tonCost;
	private Double costPerCubicMeter;
	private Double costFor5CubicMeters;
	private Double density;

	public ProductSupplier() {
	}

	public ProductSupplier(Long id, Product product, Supplier supplier, Double tonCost, Double costPerCubicMeter, Double costFor5CubicMeters, Double density) {
		this.id = id;
		this.product = product;
		this.supplier = supplier;
		this.tonCost = tonCost;
		this.costPerCubicMeter = costPerCubicMeter;
		this.costFor5CubicMeters = costFor5CubicMeters;
		this.density = density;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Supplier getSupplier() {
		return supplier;
	}

	public void setSupplier(Supplier supplier) {
		this.supplier = supplier;
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

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		ProductSupplier that = (ProductSupplier) o;
		return Objects.equals(id, that.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

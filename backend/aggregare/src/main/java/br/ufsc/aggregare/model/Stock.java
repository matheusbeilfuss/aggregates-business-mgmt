package br.ufsc.aggregare.model;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_stock")
public class Stock implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Double tonQuantity;
	private Double m3Quantity;

	@OneToOne
	@JoinColumn(name = "product_id")
	private Product product;

	public Stock() {
	}

	public Stock(Long id, Double tonQuantity, Double m3Quantity, Product product) {
		this.id = id;
		this.tonQuantity = tonQuantity;
		this.m3Quantity = m3Quantity;
		this.product = product;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		Stock stock = (Stock) o;
		return Objects.equals(id, stock.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

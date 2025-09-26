package br.ufsc.aggregare.model;

import java.io.Serial;
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
@Table(name = "tb_price")
public class Price implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Integer m3Volume;
	private Double price;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	public Price() {
	}

	public Price(Long id, Integer m3Volume, Double price, Category category) {
		this.id = id;
		this.m3Volume = m3Volume;
		this.price = price;
		this.category = category;
	}

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

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		Price price = (Price) o;
		return Objects.equals(id, price.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

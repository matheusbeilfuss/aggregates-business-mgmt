package br.ufsc.aggregare.model;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "tb_fixed_expense")
public class FixedExpense implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "O nome da despesa fixa é obrigatório.")
	private String name;

	@NotNull(message = "O valor padrão é obrigatório.")
	@Positive(message = "O valor padrão deve ser maior que zero.")
	private BigDecimal defaultValue;

	private String category;

	public FixedExpense() {
	}

	public FixedExpense(Long id, String name, BigDecimal defaultValue, String category) {
		this.id = id;
		this.name = name;
		this.defaultValue = defaultValue;
		this.category = category;
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

	public BigDecimal getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(BigDecimal defaultValue) {
		this.defaultValue = defaultValue;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		FixedExpense that = (FixedExpense) o;
		return Objects.equals(id, that.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

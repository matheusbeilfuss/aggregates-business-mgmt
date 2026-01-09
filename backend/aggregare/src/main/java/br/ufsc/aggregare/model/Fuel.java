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
@Table(name = "tb_fuel")
public class Fuel implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "expense_id")
	private Expense expense;

	private String vehicle;
	private Integer kmDriven;
	private Double liters;
	private Double pricePerLiter;
	private String fuelSupplier;

	public Fuel() {
	}

	public Fuel(Long id, Expense expense, String vehicle, Integer kmDriven, Double liters, Double pricePerLiter, String fuelSupplier) {
		this.id = id;
		this.expense = expense;
		this.vehicle = vehicle;
		this.kmDriven = kmDriven;
		this.liters = liters;
		this.pricePerLiter = pricePerLiter;
		this.fuelSupplier = fuelSupplier;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Expense getExpense() {
		return expense;
	}

	public void setExpense(Expense expense) {
		this.expense = expense;
	}

	public String getVehicle() {
		return vehicle;
	}

	public void setVehicle(String vehicle) {
		this.vehicle = vehicle;
	}

	public Integer getKmDriven() {
		return kmDriven;
	}

	public void setKmDriven(Integer kmDriven) {
		this.kmDriven = kmDriven;
	}

	public Double getLiters() {
		return liters;
	}

	public void setLiters(Double liters) {
		this.liters = liters;
	}

	public Double getPricePerLiter() {
		return pricePerLiter;
	}

	public void setPricePerLiter(Double pricePerLiter) {
		this.pricePerLiter = pricePerLiter;
	}

	public String getFuelSupplier() {
		return fuelSupplier;
	}

	public void setFuelSupplier(String fuelSupplier) {
		this.fuelSupplier = fuelSupplier;
	}

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		Fuel fuel = (Fuel) o;
		return Objects.equals(id, fuel.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

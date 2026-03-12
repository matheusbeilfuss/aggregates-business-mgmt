package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;

public class ExpenseDTO {
	private Long id;
	private String name;
	private BigDecimal expenseValue;
	private LocalDate date;
	private LocalDate dueDate;
	private LocalDate paymentDate;
	private ExpenseTypeEnum type;
	private PaymentStatusEnum paymentStatus;
	private String category;

	private String vehicle;
	private Double kmDriven;
	private Double liters;
	private Double pricePerLiter;
	private String fuelSupplier;

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

	public BigDecimal getExpenseValue() {
		return expenseValue;
	}

	public void setExpenseValue(BigDecimal expenseValue) {
		this.expenseValue = expenseValue;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public LocalDate getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
	}

	public ExpenseTypeEnum getType() {
		return type;
	}

	public void setType(ExpenseTypeEnum type) {
		this.type = type;
	}

	public PaymentStatusEnum getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatusEnum paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getVehicle() {
		return vehicle;
	}

	public void setVehicle(String vehicle) {
		this.vehicle = vehicle;
	}

	public Double getKmDriven() {
		return kmDriven;
	}

	public void setKmDriven(Double kmDriven) {
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
}

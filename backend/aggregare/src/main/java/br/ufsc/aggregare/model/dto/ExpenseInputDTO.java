package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;

public class ExpenseInputDTO {

	private String name;
	private BigDecimal expenseValue;
	private LocalDate date;
	private LocalDate dueDate;
	private LocalDate paymentDate;
	private ExpenseTypeEnum type;
	private PaymentStatusEnum paymentStatus;
	private String category;
	private String vehicle;
	private Integer kmDriven;
	private Double liters;
	private Double pricePerLiter;
	private String fuelSupplier;

	public ExpenseInputDTO() {
	}

	public ExpenseInputDTO(String name, BigDecimal expenseValue, LocalDate date, LocalDate dueDate, LocalDate paymentDate, ExpenseTypeEnum type, PaymentStatusEnum paymentStatus,
			String category, String vehicle, Integer kmDriven, Double liters, Double pricePerLiter, String fuelSupplier) {
		this.name = name;
		this.expenseValue = expenseValue;
		this.date = date;
		this.dueDate = dueDate;
		this.paymentDate = paymentDate;
		this.type = type;
		this.paymentStatus = paymentStatus;
		this.category = category;
		this.vehicle = vehicle;
		this.kmDriven = kmDriven;
		this.liters = liters;
		this.pricePerLiter = pricePerLiter;
		this.fuelSupplier = fuelSupplier;
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
}

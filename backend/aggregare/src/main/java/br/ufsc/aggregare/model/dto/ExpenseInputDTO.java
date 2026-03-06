package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ExpenseInputDTO {

	@NotBlank(message = "O nome da despesa é obrigatório.")
	private String name;

	@NotNull(message = "O valor da despesa é obrigatório.")
	@Positive(message = "O valor da despesa deve ser maior que zero.")
	private BigDecimal expenseValue;

	@NotNull(message = "A data da despesa é obrigatória.")
	private LocalDate date;

	private LocalDate dueDate;
	private LocalDate paymentDate;

	@NotNull(message = "O tipo da despesa é obrigatório.")
	private ExpenseTypeEnum type;

	@NotNull(message = "O status da despesa é obrigatório.")
	private PaymentStatusEnum paymentStatus;

	@NotBlank(message = "A categoria da despesa é obrigatória.")
	private String category;

	private String vehicle;
	private Double kmDriven;
	private Double liters;
	private Double pricePerLiter;
	private String fuelSupplier;

	public ExpenseInputDTO() {
	}

	public ExpenseInputDTO(String name, BigDecimal expenseValue, LocalDate date, LocalDate dueDate, LocalDate paymentDate, ExpenseTypeEnum type, PaymentStatusEnum paymentStatus,
			String category, String vehicle, Double kmDriven, Double liters, Double pricePerLiter, String fuelSupplier) {
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

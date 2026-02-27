package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;

import br.ufsc.aggregare.model.enums.PaymentStatusEnum;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public class StockReplenishDTO {

	@NotNull(message = "A quantidade em toneladas é obrigatória.")
	@Positive(message = "A quantidade em toneladas deve ser maior que zero.")
	private Double tonQuantity;

	@NotNull(message = "A quantidade em m³ é obrigatória.")
	@Positive(message = "A quantidade em m³ deve ser maior que zero.")
	private Double m3Quantity;

	@Positive(message = "A densidade deve ser maior que zero.")
	private Double density;

	@PositiveOrZero(message = "O valor da despesa não pode ser negativo.")
	private BigDecimal expenseValue;

	@NotNull(message = "O status do pagamento é obrigatório.")
	private PaymentStatusEnum paymentStatus;

	public StockReplenishDTO() {
	}

	public StockReplenishDTO(Double tonQuantity, Double m3Quantity, Double density, BigDecimal expenseValue, PaymentStatusEnum paymentStatus) {
		this.tonQuantity = tonQuantity;
		this.m3Quantity = m3Quantity;
		this.density = density;
		this.expenseValue = expenseValue;
		this.paymentStatus = paymentStatus;
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

	public Double getDensity() {
		return density;
	}

	public void setDensity(Double density) {
		this.density = density;
	}

	public BigDecimal getExpenseValue() {
		return expenseValue;
	}

	public void setExpenseValue(BigDecimal expenseValue) {
		this.expenseValue = expenseValue;
	}

	public PaymentStatusEnum getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatusEnum paymentStatus) {
		this.paymentStatus = paymentStatus;
	}
}

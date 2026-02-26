package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;

import br.ufsc.aggregare.model.enums.PaymentStatusEnum;

public class StockReplenishDTO {

	private Double tonQuantity;
	private Double m3Quantity;
	private Double density;
	private BigDecimal expenseValue;
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

package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;

import br.ufsc.aggregare.model.enums.PaymentMethodEnum;

public class PaymentInputDTO {

	private BigDecimal paymentValue;
	private PaymentMethodEnum paymentMethod;

	public PaymentInputDTO() {
	}

	public PaymentInputDTO(BigDecimal paymentValue, PaymentMethodEnum paymentMethod) {
		this.paymentValue = paymentValue;
		this.paymentMethod = paymentMethod;
	}

	public BigDecimal getPaymentValue() {
		return paymentValue;
	}

	public void setPaymentValue(BigDecimal paymentValue) {
		this.paymentValue = paymentValue;
	}

	public PaymentMethodEnum getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(PaymentMethodEnum paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
}

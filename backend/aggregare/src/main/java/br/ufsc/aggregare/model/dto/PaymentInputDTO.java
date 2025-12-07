package br.ufsc.aggregare.model.dto;

import br.ufsc.aggregare.model.enums.PaymentMethodEnum;

public class PaymentInputDTO {

	private Double paymentValue;
	private PaymentMethodEnum paymentMethod;

	public PaymentInputDTO() {
	}

	public PaymentInputDTO(Double paymentValue, PaymentMethodEnum paymentMethod) {
		this.paymentValue = paymentValue;
		this.paymentMethod = paymentMethod;
	}

	public Double getPaymentValue() {
		return paymentValue;
	}

	public void setPaymentValue(Double paymentValue) {
		this.paymentValue = paymentValue;
	}

	public PaymentMethodEnum getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(PaymentMethodEnum paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
}

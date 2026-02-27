package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;

import br.ufsc.aggregare.model.enums.PaymentMethodEnum;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PaymentInputDTO {

	@NotNull(message = "O valor do pagamento é obrigatório.")
	@Positive(message = "O valor do pagamento deve ser maior que zero.")
	private BigDecimal paymentValue;

	@NotNull(message = "O método de pagamento é obrigatório.")
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

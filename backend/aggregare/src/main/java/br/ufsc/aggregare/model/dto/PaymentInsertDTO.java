package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotNull;

public class PaymentInsertDTO extends PaymentInputDTO {

	@NotNull(message = "O pedido é obrigatório.")
	private Long orderId;

	public PaymentInsertDTO() {
		super();
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}
}

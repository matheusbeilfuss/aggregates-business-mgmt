package br.ufsc.aggregare.model.dto;

public class PaymentInsertDTO extends PaymentInputDTO {

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

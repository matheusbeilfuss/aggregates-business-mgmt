package br.ufsc.aggregare.model.dto;

public class StockUpdateDTO {

	private Double tonQuantity;
	private Double m3Quantity;
	private Long productId;

	public StockUpdateDTO() {
	}

	public StockUpdateDTO(Double tonQuantity, Double m3Quantity) {
		this.tonQuantity = tonQuantity;
		this.m3Quantity = m3Quantity;
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

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}
}

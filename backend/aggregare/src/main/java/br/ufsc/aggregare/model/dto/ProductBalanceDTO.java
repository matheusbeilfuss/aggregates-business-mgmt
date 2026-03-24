package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;

public class ProductBalanceDTO {

	private String productName;
	private String categoryName;
	private BigDecimal totalValue;

	public ProductBalanceDTO() {
	}

	public ProductBalanceDTO(String productName, String categoryName, BigDecimal totalValue) {
		this.productName = productName;
		this.categoryName = categoryName;
		this.totalValue = totalValue;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public BigDecimal getTotalValue() {
		return totalValue;
	}

	public void setTotalValue(BigDecimal totalValue) {
		this.totalValue = totalValue;
	}
}

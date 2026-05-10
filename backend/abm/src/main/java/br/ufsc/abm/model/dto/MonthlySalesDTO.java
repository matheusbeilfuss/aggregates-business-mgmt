package br.ufsc.abm.model.dto;

import java.math.BigDecimal;

public class MonthlySalesDTO {

	private Integer month;
	private BigDecimal totalSales;

	public MonthlySalesDTO() {
	}

	public MonthlySalesDTO(Integer month, BigDecimal totalSales) {
		this.month = month;
		this.totalSales = totalSales;
	}

	public Integer getMonth() {
		return month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}

	public BigDecimal getTotalSales() {
		return totalSales;
	}

	public void setTotalSales(BigDecimal totalSales) {
		this.totalSales = totalSales;
	}
}

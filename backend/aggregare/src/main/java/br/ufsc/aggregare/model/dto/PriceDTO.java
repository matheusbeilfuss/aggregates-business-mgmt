package br.ufsc.aggregare.model.dto;

public class PriceDTO {
	private Long id;
	private Integer m3Volume;
	private Double price;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getM3Volume() {
		return m3Volume;
	}

	public void setM3Volume(Integer m3Volume) {
		this.m3Volume = m3Volume;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
}

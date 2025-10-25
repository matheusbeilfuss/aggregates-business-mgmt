package br.ufsc.aggregare.model.dto;

public class ProductInputDTO {

	private String name;
	private Long categoryId;

	public ProductInputDTO() {
	}

	public ProductInputDTO(String name, Long categoryId) {
		this.name = name;
		this.categoryId = categoryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
}

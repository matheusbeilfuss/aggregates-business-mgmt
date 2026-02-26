package br.ufsc.aggregare.model.dto;

import jakarta.validation.constraints.NotBlank;

public class ProductInputDTO {

	@NotBlank(message = "O nome do produto é obrigatório.")
	private String name;

	private Long categoryId;
	private String categoryName;

	public ProductInputDTO() {
	}

	public ProductInputDTO(String name, Long categoryId, String categoryName) {
		this.name = name;
		this.categoryId = categoryId;
		this.categoryName = categoryName;
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

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
}

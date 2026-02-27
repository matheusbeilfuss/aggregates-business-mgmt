package br.ufsc.aggregare.validator;

import br.ufsc.aggregare.model.dto.ProductInputDTO;
import br.ufsc.aggregare.validator.exception.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class ProductValidator {

	public void validate(ProductInputDTO dto) {
		validateCategory(dto);
	}

	private void validateCategory(ProductInputDTO dto) {
		boolean hasId = dto.getCategoryId() != null;
		boolean hasName = dto.getCategoryName() != null && !dto.getCategoryName().trim().isEmpty();

		if (!hasId && !hasName) {
			throw new ValidationException("É necessário informar uma categoria existente ou o nome de uma nova categoria.");
		}
		if (hasId && hasName) {
			throw new ValidationException("Informe apenas uma categoria existente ou o nome de uma nova categoria, não ambos.");
		}
	}
}

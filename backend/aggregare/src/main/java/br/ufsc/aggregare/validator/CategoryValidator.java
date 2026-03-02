package br.ufsc.aggregare.validator;

import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.repository.CategoryRepository;
import br.ufsc.aggregare.validator.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CategoryValidator {

	private final CategoryRepository repository;

	@Autowired
	public CategoryValidator(CategoryRepository repository) {
		this.repository = repository;
	}

	public void validateInsert(Category category) {
		if (repository.existsByNameIgnoreCase(category.getName().trim())) {
			throw new ValidationException(
					"Já existe uma categoria com o nome \"" + category.getName().trim() + "\".");
		}
	}

	public void validateUpdate(Long id, Category category) {
		repository.findByNameIgnoreCase(category.getName().trim())
				.filter(existing -> !existing.getId().equals(id))
				.ifPresent(existing -> {
					throw new ValidationException(
							"Já existe uma categoria com o nome \"" + category.getName().trim() + "\".");
				});
	}
}

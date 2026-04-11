package br.ufsc.abm.validator;

import br.ufsc.abm.model.Category;
import br.ufsc.abm.repository.CategoryRepository;
import br.ufsc.abm.validator.exception.ValidationException;
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
		if (repository.existsByNameIgnoreCase(category.getName())) {
			throw new ValidationException(
					"Já existe uma categoria com o nome \"" + category.getName() + "\".");
		}
	}

	public void validateUpdate(Long id, Category category) {
		repository.findByNameIgnoreCase(category.getName())
				.filter(existing -> !existing.getId().equals(id))
				.ifPresent(existing -> {
					throw new ValidationException(
							"Já existe uma categoria com o nome \"" + category.getName() + "\".");
				});
	}
}

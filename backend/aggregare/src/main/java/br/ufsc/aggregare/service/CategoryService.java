package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.repository.CategoryRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoryService {

	private final CategoryRepository repository;

	@Autowired
	public CategoryService(CategoryRepository repository) {
		this.repository = repository;
	}

	public Category insert(Category category) {
		return repository.save(category);
	}

	public void delete(Long id) {
		try {
			if (!repository.existsById(id)){
				throw new ResourceNotFoundException(id);
			}
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}

	public Category update(Long id, Category newCategory) {
		try {
			Category existingCategory = repository.getReferenceById(id);
			updateData(existingCategory, newCategory);
			return repository.save(existingCategory);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public void updateData(Category existingCategory, Category newCategory) {
		existingCategory.setName(newCategory.getName());
	}

	public Category findById(Long id) {
		Optional<Category> category = repository.findById(id);
		return category.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Category> findAll() {
		return repository.findAll();
	}
}

package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.repository.CategoryRepository;
import br.ufsc.aggregare.repository.ProductRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoryService {

	private final CategoryRepository repository;
	private final PriceService priceService;
	private final ProductRepository productRepository;

	@Autowired
	public CategoryService(CategoryRepository repository, PriceService priceService, ProductRepository productRepository) {
		this.repository = repository;
		this.priceService = priceService;
		this.productRepository = productRepository;
	}

	public Category insert(Category category) {
		repository.save(category);
		priceService.createInitialPricesForCategory(category);
		return category;
	}

	@Transactional
	public void delete(Long id) {
		if (!repository.existsById(id)) {
			throw new ResourceNotFoundException(id);
		}

		if (productRepository.existsByCategoryId(id)) {
			throw new DatabaseException("Não é possível excluir uma categoria que possui produtos cadastrados.");
		}

		priceService.deleteAllByCategoryId(id);
		repository.deleteById(id);
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

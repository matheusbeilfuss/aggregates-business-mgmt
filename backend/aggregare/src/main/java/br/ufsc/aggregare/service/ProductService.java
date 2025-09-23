package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.dto.ProductInsertDTO;
import br.ufsc.aggregare.repository.ProductRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {

	private final ProductRepository repository;
	private final StockService stockService;
	private final CategoryService categoryService;

	@Autowired
	public ProductService(ProductRepository repository, StockService stockService, CategoryService categoryService) {
		this.repository = repository;
		this.stockService = stockService;
		this.categoryService = categoryService;
	}

	public Product insert(Product product) {
		try {
			Category existingCategory = categoryService.findById(product.getCategory().getId());
			product.setCategory(existingCategory);
			Product savedProduct = repository.save(product);
			stockService.createInitialStockForProduct(product);
			return savedProduct;
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(product.getCategory().getId());
		}
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

	public Product update(Long id, Product newProduct) {
		try {
			Product existingProduct = repository.getReferenceById(id);
			updateData(existingProduct, newProduct);
			return repository.save(existingProduct);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public void updateData(Product existingProduct, Product newProduct) {
		existingProduct.setName(newProduct.getName());
		existingProduct.setCategory(newProduct.getCategory());
	}

	public Product findById(Long id) {
		Optional<Product> product = repository.findById(id);
		return product.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Product> findAll() {
		return repository.findAll();
	}

	public Product fromDTO(ProductInsertDTO dto) {
		Category category = categoryService.findById(dto.getCategoryId());
		return new Product(null, dto.getName(), category);
	}
}

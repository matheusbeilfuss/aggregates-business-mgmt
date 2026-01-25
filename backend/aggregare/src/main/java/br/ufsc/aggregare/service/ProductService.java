package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.dto.ProductInputDTO;
import br.ufsc.aggregare.repository.ProductRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {

	private final ProductRepository repository;
	private final ProductSupplierService productSupplierService;
	private final StockService stockService;
	private final CategoryService categoryService;

	@Autowired
	public ProductService(ProductRepository repository, ProductSupplierService productSupplierService, StockService stockService, CategoryService categoryService) {
		this.repository = repository;
		this.productSupplierService = productSupplierService;
		this.stockService = stockService;
		this.categoryService = categoryService;
	}

	public Product insert(ProductInputDTO dto) {
		try {
			Product product = fromDTO(dto);
			Product savedProduct = repository.save(product);
			stockService.createInitialStockForProduct(product);
			return savedProduct;
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(dto.getCategoryId());
		}
	}

	@Transactional
	public void delete(Long id) {
		try {
			if (!repository.existsById(id)){
				throw new ResourceNotFoundException(id);
			}
			productSupplierService.deleteAllByProductId(id);
			stockService.deleteByProductId(id);
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}

	public Product update(Long id, ProductInputDTO dto) {
		try {
			Product newProduct = fromDTO(dto);
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

	public Product fromDTO(ProductInputDTO dto) {
		boolean hasId = dto.getCategoryId() != null;
		boolean hasName = dto.getCategoryName() != null && !dto.getCategoryName().trim().isEmpty();

		if (hasId == hasName) {
			throw new ResourceNotFoundException(
					String.format("%s, %s", String.valueOf(dto.getCategoryId()), String.valueOf(dto.getCategoryName()))
			);
		}

		Category category;
		if (hasName) {
			Category newCategory = new Category();
			newCategory.setName(dto.getCategoryName().trim());
			category = categoryService.insert(newCategory);
		} else {
			category = categoryService.findById(dto.getCategoryId());
		}

		return new Product(null, dto.getName(), category);
	}
}

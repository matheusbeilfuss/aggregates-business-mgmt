package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.repository.ProductRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {

	private final ProductRepository repository;
	private final StockService stockService;

	@Autowired
	public ProductService(ProductRepository repository, StockService stockService) {
		this.repository = repository;
		this.stockService = stockService;
	}

	public Product insert(Product product) {
		Product savedProduct = repository.save(product);
		stockService.createInitialStockForProduct(product);
		return savedProduct;
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
	}

	public Product findById(Long id) {
		Optional<Product> product = repository.findById(id);
		return product.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Product> findAll() {
		return repository.findAll();
	}
}

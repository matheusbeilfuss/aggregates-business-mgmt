package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.Stock;
import br.ufsc.aggregare.repository.ProductRepository;
import br.ufsc.aggregare.repository.StockRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class StockService {

	private final StockRepository repository;
	private final ProductRepository productRepository;

	@Autowired
	public StockService(StockRepository repository, ProductRepository productRepository) {
		this.repository = repository;
		this.productRepository = productRepository;
	}

	public void createInitialStockForProduct(Product product) {
		Stock initialStock = new Stock();
		initialStock.setProduct(product);
		initialStock.setTonQuantity(0.0);
		initialStock.setM3Quantity(0.0);
		repository.save(initialStock);
	}

	public void delete(Long id) {
		try {
			if (!repository.existsById(id)){
				throw new ResourceNotFoundException(id);
			}
			Stock stock = repository.getReferenceById(id);
			productRepository.deleteById(stock.getProduct().getId());
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}

	public Stock update(Long id, Stock newStock) {
		try {
			Stock existingStock = repository.getReferenceById(id);
			updateData(existingStock, newStock);
			return repository.save(existingStock);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public void updateData(Stock existingStock, Stock newStock) {
		existingStock.setProduct(newStock.getProduct());
		existingStock.setTonQuantity(newStock.getTonQuantity());
		existingStock.setM3Quantity(newStock.getM3Quantity());
	}

	public Stock findById(Long id) {
		Optional<Stock> stock = repository.findById(id);
		return stock.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Stock> findAll() {
		return repository.findAll();
	}
}

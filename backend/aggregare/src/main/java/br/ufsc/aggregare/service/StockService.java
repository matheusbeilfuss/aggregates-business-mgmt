package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.Stock;
import br.ufsc.aggregare.repository.StockRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class StockService {

	private final StockRepository repository;

	@Autowired
	public StockService(StockRepository repository) {
		this.repository = repository;
	}

	public void createInitialStockForProduct(Product product) {
		Stock initialStock = new Stock();
		initialStock.setProduct(product);
		initialStock.setTonQuantity(0.0);
		initialStock.setM3Quantity(0.0);
		repository.save(initialStock);
	}

	@Transactional
	public void deleteByProductId(Long productId) {
		repository.deleteByProductId(productId);
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

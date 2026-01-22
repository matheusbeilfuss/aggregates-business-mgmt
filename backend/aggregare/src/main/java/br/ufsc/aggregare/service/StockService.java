package br.ufsc.aggregare.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.Stock;
import br.ufsc.aggregare.model.dto.StockReplenishDTO;
import br.ufsc.aggregare.model.dto.StockUpdateDTO;
import br.ufsc.aggregare.repository.ProductRepository;
import br.ufsc.aggregare.repository.StockRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class StockService {

	private final StockRepository repository;
	private final ProductRepository productRepository;
	private final ExpenseService expenseService;

	@Autowired
	public StockService(StockRepository repository, ProductRepository productRepository, ExpenseService expenseService) {
		this.repository = repository;
		this.productRepository = productRepository;
		this.expenseService = expenseService;
	}

	public void createInitialStockForProduct(Product product) {
		Stock initialStock = new Stock();
		initialStock.setProduct(product);
		initialStock.setTonQuantity(0.0);
		initialStock.setM3Quantity(0.0);
		repository.save(initialStock);
	}

	@Transactional
	public Stock replenishStock(Long productId, StockReplenishDTO dto) {
		Stock stock = repository.findByProductId(productId)
				.orElseThrow(() -> new ResourceNotFoundException(productId));

		Double currentTonQuantity = stock.getTonQuantity() != null ? stock.getTonQuantity() : 0.0;
		Double tonQuantityToAdd = dto.getTonQuantity() != null ? dto.getTonQuantity() : 0.0;
		stock.setTonQuantity(currentTonQuantity + tonQuantityToAdd);

		Double currentM3Quantity = stock.getM3Quantity() != null ? stock.getM3Quantity() : 0.0;
		Double m3QuantityToAdd = dto.getM3Quantity() != null ? dto.getM3Quantity() : 0.0;
		stock.setM3Quantity(currentM3Quantity + m3QuantityToAdd);

		repository.save(stock);

		if (dto.getExpenseValue() != null && dto.getExpenseValue().compareTo(BigDecimal.ZERO) > 0) {
			expenseService.createExpenseForStockReplenishment(stock, dto);
		}

		return stock;
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

	public Stock fromDTO(StockUpdateDTO dto) {
		Optional<Product> optionalProduct = productRepository.findById(dto.getProductId());
		Product product = optionalProduct.orElseThrow(
				() -> new ResourceNotFoundException(dto.getProductId())
		);
		return new Stock(null, dto.getTonQuantity(), dto.getM3Quantity(), product);
	}
}

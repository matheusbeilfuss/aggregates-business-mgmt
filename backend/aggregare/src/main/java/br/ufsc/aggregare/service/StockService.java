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
import br.ufsc.aggregare.validator.exception.ValidationException;

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
		initialStock.setDensity(null);
		repository.save(initialStock);
	}

	@Transactional
	public Stock replenishStock(Long id, StockReplenishDTO dto) {
		Stock stock = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		Double currentTonQuantity = stock.getTonQuantity() != null ? stock.getTonQuantity() : 0.0;
		Double tonQuantityToAdd = dto.getTonQuantity() != null ? dto.getTonQuantity() : 0.0;
		stock.setTonQuantity(currentTonQuantity + tonQuantityToAdd);

		Double currentM3Quantity = stock.getM3Quantity() != null ? stock.getM3Quantity() : 0.0;
		Double m3QuantityToAdd = dto.getM3Quantity() != null ? dto.getM3Quantity() : 0.0;
		stock.setM3Quantity(currentM3Quantity + m3QuantityToAdd);

		Double densityToSet = dto.getDensity() != null ? dto.getDensity() : stock.getDensity();
		stock.setDensity(densityToSet);

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
		existingStock.setDensity(newStock.getDensity());
	}

	@Transactional
	public Double deductStockForOrder(Product product, Double m3Quantity) {
		Stock stock = repository.findByProductId(product.getId())
				.orElseThrow(() -> new ResourceNotFoundException(product.getId()));

		double availableM3 = stock.getM3Quantity() != null ? stock.getM3Quantity() : 0.0;
		double availableTon = stock.getTonQuantity() != null ? stock.getTonQuantity() : 0.0;
		double density = stock.getDensity() != null ? stock.getDensity() : 0.0;
		double tonToDeduct = m3Quantity * density;

		if (availableM3 < m3Quantity) {
			throw new ValidationException(
					String.format("Estoque insuficiente. Disponível: %.2f m³, solicitado: %.2f m³.",
							availableM3, m3Quantity));
		}

		if (availableTon < tonToDeduct) {
			throw new ValidationException(
					String.format("Estoque insuficiente em toneladas. Disponível: %.2f ton, necessário: %.2f ton.",
							availableTon, tonToDeduct));
		}

		stock.setM3Quantity(availableM3 - m3Quantity);
		stock.setTonQuantity(availableTon - tonToDeduct);

		repository.save(stock);
		return tonToDeduct;
	}

	@Transactional
	public void restoreStockForOrder(Product product, Double m3Quantity, Double tonQuantity) {
		Stock stock = repository.findByProductId(product.getId())
				.orElseThrow(() -> new ResourceNotFoundException(product.getId()));

		stock.setM3Quantity((stock.getM3Quantity() != null ? stock.getM3Quantity() : 0.0) + m3Quantity);
		stock.setTonQuantity((stock.getTonQuantity() != null ? stock.getTonQuantity() : 0.0) + tonQuantity);

		repository.save(stock);
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
		return new Stock(null, dto.getTonQuantity(), dto.getM3Quantity(), dto.getDensity(), product);
	}
}

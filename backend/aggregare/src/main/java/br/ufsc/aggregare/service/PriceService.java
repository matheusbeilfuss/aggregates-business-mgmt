package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.model.Price;
import br.ufsc.aggregare.repository.PriceRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

@Service
public class PriceService {

	private final PriceRepository repository;

	@Autowired
	public PriceService(PriceRepository repository) {
		this.repository = repository;
	}

	public void createInitialPricesForCategory(Category category) {
		for (int i = 0; i < 6; i++) {
			Price initialPrice = new Price();
			initialPrice.setCategory(category);
			initialPrice.setM3Volume(i);
			initialPrice.setPrice(0.0);
			repository.save(initialPrice);
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

	public Price update(Long id, Price newPrice) {
		try {
			Price existingPrice = repository.getReferenceById(id);
			updateData(existingPrice, newPrice);
			return repository.save(existingPrice);
		} catch (Exception e) {
			throw new ResourceNotFoundException(id);
		}
	}

	public void updateData(Price existingPrice, Price newPrice) {
		existingPrice.setPrice(newPrice.getPrice());
		existingPrice.setM3Volume(newPrice.getM3Volume());
		existingPrice.setCategory(newPrice.getCategory());
	}

	public Price findById(Long id) {
		Optional<Price> price = repository.findById(id);
		return price.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Price> findAll() {
		return repository.findAll();
	}
}

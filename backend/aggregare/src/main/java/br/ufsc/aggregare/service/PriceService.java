package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.model.Price;
import br.ufsc.aggregare.model.dto.PriceDTO;
import br.ufsc.aggregare.repository.CategoryRepository;
import br.ufsc.aggregare.repository.PriceRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

@Service
public class PriceService {

	private final PriceRepository repository;
	private final CategoryRepository categoryRepository;

	@Autowired
	public PriceService(PriceRepository repository, CategoryRepository categoryRepository) {
		this.repository = repository;
		this.categoryRepository = categoryRepository;
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

	public List<Price> findByCategoryId(Long categoryId) {
		return repository.findByCategoryId(categoryId);
	}

	@Transactional(readOnly = true)
	public List<PriceDTO> findPricesByCategoryId(Long categoryId) {
		if (!categoryRepository.existsById(categoryId)) {
			throw new ResourceNotFoundException(categoryId);
		}
		List<Price> prices = repository.findByCategoryId(categoryId);
		return prices.stream().map(this::toDTO).toList();
	}

	@Transactional
	public List<PriceDTO> updatePricesForCategory(Long categoryId, List<PriceDTO> priceDTOs) {
		if (!categoryRepository.existsById(categoryId)) {
			throw new ResourceNotFoundException(categoryId);
		}

		Map<Integer, Price> existingPricesMap = repository.findByCategoryId(categoryId).stream()
				.collect(Collectors.toMap(Price::getM3Volume, Function.identity()));

		priceDTOs.forEach(dto -> {
			Price existingPrice = existingPricesMap.get(dto.getM3Volume());
			if (existingPrice != null) {
				existingPrice.setPrice(dto.getPrice());
			}
		});

		List<Price> updatedPrices = repository.saveAll(existingPricesMap.values());
		return updatedPrices.stream().map(this::toDTO).toList();
	}

	private PriceDTO toDTO(Price price) {
		PriceDTO dto = new PriceDTO();
		dto.setId(price.getId());
		dto.setM3Volume(price.getM3Volume());
		dto.setPrice(price.getPrice());
		return dto;
	}
}

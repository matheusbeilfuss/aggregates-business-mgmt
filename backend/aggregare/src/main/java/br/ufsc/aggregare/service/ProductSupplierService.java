package br.ufsc.aggregare.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.ProductSupplier;
import br.ufsc.aggregare.model.Supplier;
import br.ufsc.aggregare.model.dto.ProductSupplierDTO;
import br.ufsc.aggregare.model.dto.ProductSupplierInputDTO;
import br.ufsc.aggregare.repository.ProductRepository;
import br.ufsc.aggregare.repository.ProductSupplierRepository;
import br.ufsc.aggregare.repository.SupplierRepository;
import br.ufsc.aggregare.service.exception.DatabaseException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductSupplierService {

	private final ProductSupplierRepository repository;
	private final ProductRepository productRepository;
	private final SupplierRepository supplierRepository;

	@Autowired
	public ProductSupplierService(ProductSupplierRepository repository, ProductRepository productRepository, SupplierRepository supplierRepository) {
		this.repository = repository;
		this.productRepository = productRepository;
		this.supplierRepository = supplierRepository;
	}

	@Transactional
	public ProductSupplierDTO insert(ProductSupplierInputDTO dto) {
		ProductSupplier productSupplier = fromDTO(dto);
		productSupplier = repository.save(productSupplier);
		return toDTO(productSupplier);
	}

	private ProductSupplierDTO toDTO(ProductSupplier productSupplier) {
		ProductSupplierDTO dto = new ProductSupplierDTO();
		dto.setId(productSupplier.getId());
		dto.setSupplierId(productSupplier.getSupplier().getId());
		dto.setSupplierName(productSupplier.getSupplier().getName());
		dto.setDensity(productSupplier.getDensity());
		dto.setTonCost(productSupplier.getTonCost());
		dto.setCostPerCubicMeter(productSupplier.getCostPerCubicMeter());
		dto.setCostFor5CubicMeters(productSupplier.getCostFor5CubicMeters());
		return dto;
	}

	private ProductSupplier fromDTO(ProductSupplierInputDTO dto) {
		Product product = productRepository.findById(dto.getProductId())
				.orElseThrow(() -> new ResourceNotFoundException(dto.getProductId()));
		Supplier supplier = supplierRepository.findById(dto.getSupplierId())
				.orElseThrow(() -> new ResourceNotFoundException(dto.getSupplierId()));

		return new ProductSupplier(null, product, supplier, dto.getTonCost(), dto.getCostPerCubicMeter(), dto.getCostFor5CubicMeters(), dto.getDensity());
	}

	@Transactional
	public ProductSupplierDTO update(Long id, ProductSupplierInputDTO dto) {
		try {
			ProductSupplier productSupplier = repository.getReferenceById(id);
			updateData(productSupplier, dto);
			productSupplier = repository.save(productSupplier);
			return toDTO(productSupplier);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	private void updateData(ProductSupplier productSupplier, ProductSupplierInputDTO dto) {
		productSupplier.setTonCost(dto.getTonCost());
		productSupplier.setCostPerCubicMeter(dto.getCostPerCubicMeter());
		productSupplier.setCostFor5CubicMeters(dto.getCostFor5CubicMeters());
		productSupplier.setDensity(dto.getDensity());
	}

	public void delete(Long id) {
		if (!repository.existsById(id)){
			throw new ResourceNotFoundException(id);
		}
		try {
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}

	@Transactional
	public void deleteAllByProductId(Long productId) {
		repository.deleteAllByProductId(productId);
	}

	@Transactional(readOnly = true)
	public List<ProductSupplierDTO> findSupplierByProductId(Long productId) {
		if (!productRepository.existsById(productId)) {
			throw new ResourceNotFoundException(productId);
		}
		List<ProductSupplier> productSuppliers = repository.findByProductId(productId);
		return productSuppliers.stream().map(this::toDTO).toList();
	}
}

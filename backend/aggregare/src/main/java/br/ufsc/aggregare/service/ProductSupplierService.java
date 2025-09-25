package br.ufsc.aggregare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.repository.ProductSupplierRepository;

@Service
public class ProductSupplierService {

	private final ProductSupplierRepository repository;

	@Autowired
	public ProductSupplierService(ProductSupplierRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public void deleteAllByProductId(Long productId) {
		repository.deleteAllByProductId(productId);
	}
}

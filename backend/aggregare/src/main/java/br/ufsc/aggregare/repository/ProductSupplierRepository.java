package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.ProductSupplier;

public interface ProductSupplierRepository extends JpaRepository<ProductSupplier, Long> {

	void deleteAllByProductId(Long productId);
}

package br.ufsc.aggregare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.ProductSupplier;

public interface ProductSupplierRepository extends JpaRepository<ProductSupplier, Long> {

	void deleteAllByProductId(Long productId);

	List<ProductSupplier> findByProductId(Long productId);
}

package br.ufsc.abm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.abm.model.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {

	Optional<Stock> findByProductId(Long productId);

	void deleteByProductId(Long productId);
}

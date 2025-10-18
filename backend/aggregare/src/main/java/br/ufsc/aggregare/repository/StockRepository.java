package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {

	void deleteByProductId(Long productId);
}

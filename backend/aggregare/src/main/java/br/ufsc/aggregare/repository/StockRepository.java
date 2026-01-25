package br.ufsc.aggregare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {

	void deleteByProductId(Long productId);
}

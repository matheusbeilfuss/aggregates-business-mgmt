package br.ufsc.aggregare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Price;

public interface PriceRepository extends JpaRepository<Price, Long> {

	List<Price> findByCategoryId(Long categoryId);
	void deleteByCategoryId(Long categoryId);
}

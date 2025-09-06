package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Price;

public interface PriceRepository extends JpaRepository<Price, Long> {

}

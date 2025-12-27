package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Fuel;

public interface FuelRepository extends JpaRepository<Fuel, Long> {

	void deleteByExpenseId(Long expenseId);
}

package br.ufsc.abm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.ufsc.abm.model.Fuel;

public interface FuelRepository extends JpaRepository<Fuel, Long> {

	void deleteByExpenseId(Long expenseId);

	Optional<Fuel> findByExpenseId(Long expenseId);

	List<Fuel> findByExpenseIdIn(List<Long> expenseIds);

	@Query("SELECT DISTINCT f.vehicle FROM Fuel f WHERE f.vehicle IS NOT NULL AND f.vehicle <> ''")
	List<String> findDistinctVehicles();

	@Query("SELECT DISTINCT f.fuelSupplier FROM Fuel f WHERE f.fuelSupplier IS NOT NULL AND f.fuelSupplier <> ''")
	List<String> findDistinctFuelSuppliers();
}

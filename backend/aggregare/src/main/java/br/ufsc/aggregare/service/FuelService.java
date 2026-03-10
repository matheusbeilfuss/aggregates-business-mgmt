package br.ufsc.aggregare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.Fuel;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.repository.FuelRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

@Service
public class FuelService {

	private final FuelRepository fuelRepository;

	@Autowired
	public FuelService(FuelRepository fuelRepository) {
		this.fuelRepository = fuelRepository;
	}

	@Transactional
	public Fuel insert(ExpenseInputDTO dto, Expense expense) {
		Fuel fuel = fuelFromDTO(dto, expense);
		return fuelRepository.save(fuel);
	}

	private Fuel fuelFromDTO(ExpenseInputDTO dto, Expense expense) {
		Fuel fuel = new Fuel();
		fuel.setExpense(expense);
		fuel.setVehicle(dto.getVehicle());
		fuel.setKmDriven(dto.getKmDriven());
		fuel.setLiters(dto.getLiters());
		fuel.setPricePerLiter(dto.getPricePerLiter());
		fuel.setFuelSupplier(dto.getFuelSupplier());
		return fuel;
	}

	@Transactional
	public void deleteByExpenseId(Long expenseId) {
		fuelRepository.deleteByExpenseId(expenseId);
	}

	@Transactional
	public void updateByExpenseId(Long expenseId, ExpenseInputDTO dto) {
		Fuel existingFuel = fuelRepository.findByExpenseId(expenseId)
				.orElseThrow(() -> new ResourceNotFoundException(expenseId));

		existingFuel.setVehicle(dto.getVehicle());
		existingFuel.setKmDriven(dto.getKmDriven());
		existingFuel.setLiters(dto.getLiters());
		existingFuel.setPricePerLiter(dto.getPricePerLiter());
		existingFuel.setFuelSupplier(dto.getFuelSupplier());
	}

	public Optional<Fuel> findByExpenseId(Long expenseId) {
		return fuelRepository.findByExpenseId(expenseId);
	}

	public List<Fuel> findByExpenseIdIn(List<Long> expenseIds) {
		return fuelRepository.findByExpenseIdIn(expenseIds);
	}

	public List<String> findDistinctVehicles() {
		return fuelRepository.findDistinctVehicles();
	}

	public List<String> findDistinctFuelSuppliers() {
		return fuelRepository.findDistinctFuelSuppliers();
	}
}

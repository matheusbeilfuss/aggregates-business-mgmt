package br.ufsc.aggregare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.Fuel;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.repository.FuelRepository;

import jakarta.transaction.Transactional;

@Service
public class FuelService {

	private final FuelRepository fuelRepository;

	@Autowired
	public FuelService(FuelRepository fuelRepository) {
		this.fuelRepository = fuelRepository;
	}

	@Transactional
	public Fuel insert(ExpenseInputDTO dto, Expense expense) {
		Fuel fuel = fuelExpenseFromExpenseInputDTO(dto, expense);
		return fuelRepository.save(fuel);
	}

	private Fuel fuelExpenseFromExpenseInputDTO(ExpenseInputDTO dto, Expense expense) {
		Fuel fuel = new Fuel();
		fuel.setExpense(expense);
		fuel.setVehicle(dto.getVehicle());
		fuel.setKmDriven(dto.getKmDriven());
		fuel.setLiters(dto.getLiters());
		fuel.setPricePerLiter(dto.getPricePerLiter());
		fuel.setFuelSupplier(dto.getFuelSupplier());
		return fuel;
	}

	public void deleteByExpenseId(Long expenseId) {
		fuelRepository.deleteByExpenseId(expenseId);
	}
}

package br.ufsc.aggregare.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.repository.ExpenseRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class ExpenseService {

	private final ExpenseRepository expenseRepository;
	private final FuelService fuelService;

	@Autowired
	public ExpenseService(ExpenseRepository expenseRepository, FuelService fuelService) {
		this.expenseRepository = expenseRepository;
		this.fuelService = fuelService;
	}

	@Transactional
	public Expense insert(ExpenseInputDTO dto) {
		Expense expense = expenseFromInputDTO(dto);
		Expense savedExpense = expenseRepository.save(expense);

		if (dto.getType() != null && dto.getType().equals(ExpenseTypeEnum.FUEL)) {
			fuelService.insert(dto, savedExpense);
		}

		return savedExpense;
	}

	private Expense expenseFromInputDTO(ExpenseInputDTO dto) {
		Expense expense = new Expense();
		expense.setName(dto.getName());
		expense.setExpenseValue(dto.getExpenseValue());
		expense.setDate(dto.getDate());
		expense.setDueDate(dto.getDueDate());
		expense.setPaymentDate(dto.getPaymentDate());
		expense.setType(dto.getType());
		expense.setPaymentStatus(dto.getPaymentStatus());
		expense.setCategory(dto.getCategory());

		return expense;
	}

	@Transactional
	public void delete(Long id) {
		Expense existingExpense = expenseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		if (existingExpense.getType() != null && existingExpense.getType().equals(ExpenseTypeEnum.FUEL)) {
			fuelService.deleteByExpenseId(existingExpense.getId());
		}

		expenseRepository.delete(existingExpense);
	}

	@Transactional
	public Expense update(Long id, ExpenseInputDTO dto) {

		Expense existingExpense = expenseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		ExpenseTypeEnum oldType = existingExpense.getType();
		ExpenseTypeEnum newType = dto.getType();

		boolean wasFuel = ExpenseTypeEnum.FUEL.equals(oldType);
		boolean isFuel  = ExpenseTypeEnum.FUEL.equals(newType);

		if (wasFuel && !isFuel) {
			fuelService.deleteByExpenseId(existingExpense.getId());
		}

		if (!wasFuel && isFuel) {
			fuelService.insert(dto, existingExpense);
		}

		if (wasFuel && isFuel) {
			fuelService.updateByExpenseId(existingExpense.getId(), dto);
		}

		updateExpense(existingExpense, dto);
		return expenseRepository.save(existingExpense);
	}

	private void updateExpense(Expense expense, ExpenseInputDTO dto) {
		expense.setName(dto.getName());
		expense.setExpenseValue(dto.getExpenseValue());
		expense.setDate(dto.getDate());
		expense.setDueDate(dto.getDueDate());
		expense.setPaymentDate(dto.getPaymentDate());
		expense.setType(dto.getType());
		expense.setPaymentStatus(dto.getPaymentStatus());
		expense.setCategory(dto.getCategory());
	}

	public Expense findById(Long id) {
		return expenseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Expense> findAll() {
		return expenseRepository.findAll();
	}
}

package br.ufsc.aggregare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.repository.ExpenseRepository;
import br.ufsc.aggregare.repository.FixedExpenseRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class ExpenseService {

	private final ExpenseRepository expenseRepository;
	private final FixedExpenseRepository fixedExpenseRepository;
	private final FuelService fuelService;

	@Autowired
	public ExpenseService(ExpenseRepository expenseRepository, FixedExpenseRepository fixedExpenseRepository, FuelService fuelService) {
		this.expenseRepository = expenseRepository;
		this.fixedExpenseRepository = fixedExpenseRepository;
		this.fuelService = fuelService;
	}

	@Transactional
	public Expense insert(ExpenseInputDTO dto) {
		Expense expense = expenseFromInputDTO(dto);
		Expense savedExpense = expenseRepository.save(expense);

		if (dto.getType() != null && dto.getType().equals(ExpenseTypeEnum.FUEL)) {
			fuelService.insert(dto, savedExpense);
		}

		return expense;
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
	public void delete (Long id) {
		Expense existingExpense = expenseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		if (existingExpense.getType().equals(ExpenseTypeEnum.FUEL)) {
			fuelService.deleteByExpenseId(existingExpense.getId());
		}

		expenseRepository.delete(existingExpense);
	}

	@Transactional
	public Expense update(Long id, ExpenseInputDTO dto) {
		Expense existingExpense = expenseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		updateExpense(existingExpense, dto);

		if (existingExpense.getType().equals(ExpenseTypeEnum.FUEL)) {
			fuelService.updateByExpenseId(existingExpense.getId(), dto);
		}

		expenseRepository.save(existingExpense);
		return existingExpense;
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
}

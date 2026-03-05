package br.ufsc.aggregare.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.Stock;
import br.ufsc.aggregare.model.dto.ExpenseDTO;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.model.dto.StockReplenishDTO;
import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;
import br.ufsc.aggregare.repository.ExpenseRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;
import br.ufsc.aggregare.validator.ExpenseValidator;

@Service
public class ExpenseService {

	private final ExpenseRepository expenseRepository;
	private final FuelService fuelService;
	private final ExpenseValidator expenseValidator;

	@Autowired
	public ExpenseService(ExpenseRepository expenseRepository, FuelService fuelService, ExpenseValidator expenseValidator) {
		this.expenseRepository = expenseRepository;
		this.fuelService = fuelService;
		this.expenseValidator = expenseValidator;
	}

	@Transactional
	public Expense insert(ExpenseInputDTO dto) {
		expenseValidator.validate(dto);

		Expense expense = expenseFromInputDTO(dto);
		Expense savedExpense = expenseRepository.save(expense);

		if (dto.getType() != null && dto.getType().equals(ExpenseTypeEnum.FUEL)) {
			fuelService.insert(dto, savedExpense);
		}

		return savedExpense;
	}

	private Expense expenseFromInputDTO(ExpenseInputDTO dto) {
		Expense expense = new Expense();
		updateExpense(expense, dto);
		return expense;
	}

	@Transactional
	public void createExpenseForStockReplenishment(Stock stock, StockReplenishDTO dto) {
		Expense expense = new Expense();
		expense.setName(stock.getProduct().getName());
		expense.setExpenseValue(dto.getExpenseValue());
		expense.setDate(LocalDate.now());
		expense.setDueDate(LocalDate.now().plusDays(30));

		if (dto.getPaymentStatus() != null && dto.getPaymentStatus().equals(PaymentStatusEnum.PAID)) {
			expense.setPaymentDate(LocalDate.now());
			expense.setPaymentStatus(PaymentStatusEnum.PAID);
		} else {
			expense.setPaymentDate(null);
			expense.setPaymentStatus(PaymentStatusEnum.PENDING);
		}

		expense.setType(ExpenseTypeEnum.VARIABLE);
		expense.setCategory("Estoque");

		expenseRepository.save(expense);
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
		expenseValidator.validate(dto);

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

	public ExpenseDTO findByIdWithFuel(Long id) {
		Expense expense = expenseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		ExpenseDTO dto = expenseToDTO(expense);

		if (ExpenseTypeEnum.FUEL.equals(expense.getType())) {
			fuelService.findByExpenseId(id).ifPresent(fuel -> {
				dto.setVehicle(fuel.getVehicle());
				dto.setKmDriven(fuel.getKmDriven());
				dto.setLiters(fuel.getLiters());
				dto.setPricePerLiter(fuel.getPricePerLiter());
				dto.setFuelSupplier(fuel.getFuelSupplier());
			});
		}

		return dto;
	}

	private ExpenseDTO expenseToDTO(Expense expense) {
		ExpenseDTO dto = new ExpenseDTO();
		dto.setId(expense.getId());
		dto.setName(expense.getName());
		dto.setExpenseValue(expense.getExpenseValue());
		dto.setDate(expense.getDate());
		dto.setDueDate(expense.getDueDate());
		dto.setPaymentDate(expense.getPaymentDate());
		dto.setType(expense.getType());
		dto.setPaymentStatus(expense.getPaymentStatus());
		dto.setCategory(expense.getCategory());
		return dto;
	}

	public List<Expense> findAll() {
		return expenseRepository.findAll();
	}

	public List<Expense> findByPeriod(LocalDate startDate, LocalDate endDate) {
		return expenseRepository.findByDateBetween(startDate, endDate);
	}

	public List<String> findDistinctCategories() {
		return expenseRepository.findDistinctCategories();
	}

	public List<String> findDistinctVehicles() {
		return fuelService.findDistinctVehicles();
	}

	public List<String> findDistinctFuelSuppliers() {
		return fuelService.findDistinctFuelSuppliers();
	}
}

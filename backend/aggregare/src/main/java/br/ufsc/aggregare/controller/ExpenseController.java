package br.ufsc.aggregare.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.FixedExpense;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.service.ExpenseService;

@RestController
@RequestMapping(value = "/expenses")
public class ExpenseController {

	private final ExpenseService expenseService;

	@Autowired
	public ExpenseController(ExpenseService expenseService) {
		this.expenseService = expenseService;
	}

	@PostMapping
	public ResponseEntity<Expense> insert(@RequestBody ExpenseInputDTO dto) {
		Expense expense = expenseService.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(expense.getId()).toUri();
		return ResponseEntity.created(uri).body(expense);
	}

//	@PostMapping
//	public ResponseEntity<FixedExpense> insertFixedExpense() {
//	}
}

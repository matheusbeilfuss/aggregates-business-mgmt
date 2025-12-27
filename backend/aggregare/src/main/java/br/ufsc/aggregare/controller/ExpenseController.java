package br.ufsc.aggregare.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.service.ExpenseService;

@RestController
@RequestMapping(value = "/expenses")
public class ExpenseController {

	private final ExpenseService service;

	@Autowired
	public ExpenseController(ExpenseService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Expense> insert(@RequestBody ExpenseInputDTO dto) {
		Expense expense = service.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(expense.getId()).toUri();
		return ResponseEntity.created(uri).body(expense);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
}

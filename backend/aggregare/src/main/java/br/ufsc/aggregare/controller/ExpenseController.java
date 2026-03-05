package br.ufsc.aggregare.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.service.ExpenseService;
import br.ufsc.aggregare.service.FuelService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/expenses")
public class ExpenseController {

	private final ExpenseService service;
	private final FuelService fuelService;

	@Autowired
	public ExpenseController(ExpenseService service, FuelService fuelService) {
		this.service = service;
		this.fuelService = fuelService;
	}

	@PostMapping
	public ResponseEntity<Expense> insert(@RequestBody @Valid ExpenseInputDTO dto) {
		Expense expense = service.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(expense.getId()).toUri();
		return ResponseEntity.created(uri).body(expense);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Expense> update(@PathVariable Long id, @RequestBody @Valid ExpenseInputDTO dto) {
		Expense expense = service.update(id, dto);
		return ResponseEntity.ok().body(expense);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Expense> findById(@PathVariable Long id) {
		Expense expense = service.findById(id);
		return ResponseEntity.ok().body(expense);
	}

	@GetMapping
	public ResponseEntity<List<Expense>> findAll(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate) {
		List<Expense> expenses;

		if (startDate != null && endDate != null) {
			expenses = service.findByPeriod(startDate, endDate);
		} else {
			expenses = service.findAll();
		}

		return ResponseEntity.ok().body(expenses);
	}

	@GetMapping("/categories")
	public ResponseEntity<List<String>> getCategories() {
		return ResponseEntity.ok(service.findDistinctCategories());
	}

	@GetMapping("/vehicles")
	public ResponseEntity<List<String>> getVehicles() {
		return ResponseEntity.ok(fuelService.findDistinctVehicles());
	}

	@GetMapping("/fuel-suppliers")
	public ResponseEntity<List<String>> getFuelSuppliers() {
		return ResponseEntity.ok(fuelService.findDistinctFuelSuppliers());
	}
}

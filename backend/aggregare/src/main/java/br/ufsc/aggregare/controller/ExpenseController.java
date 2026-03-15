package br.ufsc.aggregare.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.dto.ExpenseDTO;
import br.ufsc.aggregare.model.dto.ExpenseInputDTO;
import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/expenses")
public class ExpenseController {

	private final ExpenseService service;

	@Autowired
	public ExpenseController(ExpenseService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<ExpenseDTO> insert(@RequestBody @Valid ExpenseInputDTO dto) {
		ExpenseDTO expense = service.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(expense.getId()).toUri();
		return ResponseEntity.created(uri).body(expense);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<ExpenseDTO> update(@PathVariable Long id, @RequestBody @Valid ExpenseInputDTO dto) {
		return ResponseEntity.ok(service.update(id, dto));
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<ExpenseDTO> findById(@PathVariable Long id) {
		ExpenseDTO dto = service.findByIdWithFuel(id);
		return ResponseEntity.ok().body(dto);
	}

	@GetMapping
	public ResponseEntity<List<ExpenseDTO>> findAll(
			@RequestParam(required = false) LocalDate startDate,
			@RequestParam(required = false) LocalDate endDate,
			@RequestParam(required = false) ExpenseTypeEnum type
	) {
		if ((startDate == null) != (endDate == null)) {
			throw new IllegalArgumentException("As datas de início e fim do período devem ser informadas juntas");
		}


		List<ExpenseDTO> expenses = (startDate != null)
				? service.findByPeriod(startDate, endDate, type)
				: service.findAll(type);

		return ResponseEntity.ok().body(expenses);
	}

	@GetMapping("/categories")
	public ResponseEntity<List<String>> getCategories() {
		return ResponseEntity.ok(service.findDistinctCategories());
	}

	@GetMapping("/vehicles")
	public ResponseEntity<List<String>> getVehicles() {
		return ResponseEntity.ok(service.findDistinctVehicles());
	}

	@GetMapping("/fuel-suppliers")
	public ResponseEntity<List<String>> getFuelSuppliers() {
		return ResponseEntity.ok(service.findDistinctFuelSuppliers());
	}

	@PatchMapping(value = "/{id}/pay")
	public ResponseEntity<ExpenseDTO> markAsPaid(@PathVariable Long id) {
		return ResponseEntity.ok(service.markAsPaid(id));
	}
}

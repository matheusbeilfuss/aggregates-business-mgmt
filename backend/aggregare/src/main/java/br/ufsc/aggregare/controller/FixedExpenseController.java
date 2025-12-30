package br.ufsc.aggregare.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.FixedExpense;
import br.ufsc.aggregare.service.FixedExpenseService;

@RestController
@RequestMapping(value = "/fixed-expenses")
public class FixedExpenseController {

	private final FixedExpenseService service;

	@Autowired
	public FixedExpenseController(FixedExpenseService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<FixedExpense> insert(@RequestBody FixedExpense fixedExpense) {
		FixedExpense savedFixedExpense = service.insert(fixedExpense);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedFixedExpense.getId()).toUri();
		return ResponseEntity.created(uri).body(savedFixedExpense);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<FixedExpense> update(@PathVariable Long id, @RequestBody FixedExpense fixedExpense) {
		FixedExpense updatedFixedExpense = service.update(id, fixedExpense);
		return ResponseEntity.ok().body(updatedFixedExpense);
	}
}

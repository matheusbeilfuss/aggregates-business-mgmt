package br.ufsc.aggregare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.FixedExpense;
import br.ufsc.aggregare.repository.FixedExpenseRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class FixedExpenseService {

	private final FixedExpenseRepository repository;

	@Autowired
	public FixedExpenseService(FixedExpenseRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public FixedExpense insert(FixedExpense fixedExpense) {
		return repository.save(fixedExpense);
	}

	@Transactional
	public void delete(Long id) {
		FixedExpense fixedExpense = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
		repository.delete(fixedExpense);
	}

	@Transactional
	public FixedExpense update(Long id, FixedExpense fixedExpense) {
		FixedExpense existingFixedExpense = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
		updateData(existingFixedExpense, fixedExpense);
		return repository.save(existingFixedExpense);
	}

	public void updateData(FixedExpense existingFixedExpense, FixedExpense newFixedExpense) {
		existingFixedExpense.setName(newFixedExpense.getName());
		existingFixedExpense.setDefaultValue(newFixedExpense.getDefaultValue());
		existingFixedExpense.setCategory(newFixedExpense.getCategory());
	}
}

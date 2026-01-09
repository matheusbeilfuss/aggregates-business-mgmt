package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

}

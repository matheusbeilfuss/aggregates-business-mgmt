package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.FixedExpense;

public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Long> {

}

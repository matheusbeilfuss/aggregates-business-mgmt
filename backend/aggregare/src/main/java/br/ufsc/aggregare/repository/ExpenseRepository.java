package br.ufsc.aggregare.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.ufsc.aggregare.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);

	@Query("SELECT DISTINCT e.category FROM Expense e WHERE e.category IS NOT NULL AND e.category <> ''")
	List<String> findDistinctCategories();
}

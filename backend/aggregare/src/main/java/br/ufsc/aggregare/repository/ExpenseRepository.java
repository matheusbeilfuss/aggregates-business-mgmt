package br.ufsc.aggregare.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);
	List<Expense> findByDateBetweenAndType(LocalDate startDate, LocalDate endDate, ExpenseTypeEnum type);
	List<Expense> findByType(ExpenseTypeEnum type);

	@Query("SELECT DISTINCT e.category FROM Expense e WHERE e.category IS NOT NULL AND e.category <> ''")
	List<String> findDistinctCategories();
}

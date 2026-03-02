package br.ufsc.aggregare.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	boolean existsByNameIgnoreCase(String name);

	Optional<Category> findByNameIgnoreCase(String name);
}

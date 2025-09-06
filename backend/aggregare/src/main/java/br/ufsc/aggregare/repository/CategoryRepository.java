package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}

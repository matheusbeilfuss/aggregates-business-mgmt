package br.ufsc.abm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.abm.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	boolean existsByCategoryId(Long categoryId);
}

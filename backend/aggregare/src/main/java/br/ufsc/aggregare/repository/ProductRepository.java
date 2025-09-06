package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}

package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

}

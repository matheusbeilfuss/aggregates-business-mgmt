package br.ufsc.abm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.abm.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

}

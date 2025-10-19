package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
}

package br.ufsc.abm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.abm.model.OrderAddress;

public interface OrderAddressRepository extends JpaRepository<OrderAddress, Long> {

}

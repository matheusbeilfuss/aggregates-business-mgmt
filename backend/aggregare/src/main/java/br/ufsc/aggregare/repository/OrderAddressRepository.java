package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.OrderAddress;

public interface OrderAddressRepository extends JpaRepository<OrderAddress, Long> {

}

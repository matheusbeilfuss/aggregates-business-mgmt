package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}

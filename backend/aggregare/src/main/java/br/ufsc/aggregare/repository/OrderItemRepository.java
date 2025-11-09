package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}

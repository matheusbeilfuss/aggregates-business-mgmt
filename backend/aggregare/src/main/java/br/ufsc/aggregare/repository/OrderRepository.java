package br.ufsc.aggregare.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByScheduledDate(LocalDate scheduledDate);
}

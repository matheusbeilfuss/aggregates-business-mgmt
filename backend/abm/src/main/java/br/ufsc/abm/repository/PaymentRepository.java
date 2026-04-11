package br.ufsc.abm.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.abm.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

	List<Payment> findByOrderId(Long orderId);

	List<Payment> findByDateBetween(LocalDate startDate, LocalDate endDate);
}

package br.ufsc.aggregare.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByScheduledDate(LocalDate scheduledDate);

	boolean existsByProductId(Long productId);

	List<Order> findByPaymentStatusInAndScheduledDateBetween(
			List<PaymentStatusEnum> statuses,
			LocalDate startDate,
			LocalDate endDate
	);

	List<Order> findByPaymentStatusIn(List<PaymentStatusEnum> statuses);
}

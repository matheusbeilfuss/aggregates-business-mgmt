package br.ufsc.aggregare.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

	@Query("""
       SELECT o FROM Order o
       WHERE o.scheduledDate BETWEEN :startDate AND :endDate
       AND o.paymentStatus IN :statuses
       AND o.type = 'MATERIAL'
       AND o.product IS NOT NULL
       """)
	List<Order> findMaterialOrdersByPeriodAndPaymentStatusIn(
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			@Param("statuses") List<PaymentStatusEnum> statuses
	);
}

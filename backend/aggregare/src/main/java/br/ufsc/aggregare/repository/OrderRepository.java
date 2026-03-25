package br.ufsc.aggregare.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.dto.ProductBalanceDTO;
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
       SELECT new br.ufsc.aggregare.model.dto.ProductBalanceDTO(
           p.name,
           COALESCE(c.name, 'Sem categoria'),
           SUM(o.orderValue - o.remainingValue)
       )
       FROM Order o
       JOIN o.product p
       LEFT JOIN p.category c
       WHERE o.scheduledDate BETWEEN :startDate AND :endDate
       AND o.paymentStatus IN :statuses
       AND o.type = 'MATERIAL'
       AND o.product IS NOT NULL
       GROUP BY p.id, p.name, c.name
       ORDER BY SUM(o.orderValue - o.remainingValue) DESC
       """)
	List<ProductBalanceDTO> findProductBalanceSummary(
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			@Param("statuses") List<PaymentStatusEnum> statuses
	);
}

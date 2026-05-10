package br.ufsc.abm.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.ufsc.abm.model.Order;
import br.ufsc.abm.model.dto.MonthlySalesDTO;
import br.ufsc.abm.model.dto.ProductBalanceDTO;
import br.ufsc.abm.model.enums.PaymentStatusEnum;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByScheduledDate(LocalDate scheduledDate);

	boolean existsByProductId(Long productId);

	boolean existsByScheduledDateAndScheduledTime(
			LocalDate scheduledDate, LocalTime scheduledTime);

	boolean existsByClientIdAndPaymentStatusIn(Long clientId, List<PaymentStatusEnum> statuses);

	List<Order> findByPaymentStatusInAndScheduledDateBetween(
			List<PaymentStatusEnum> statuses,
			LocalDate startDate,
			LocalDate endDate
	);

	List<Order> findByPaymentStatusIn(List<PaymentStatusEnum> statuses);

	@Query("""
       SELECT new br.ufsc.abm.model.dto.ProductBalanceDTO(
           p.name,
           COALESCE(c.name, 'Sem categoria'),
           SUM(o.orderValue)
       )
       FROM Order o
       JOIN o.product p
       LEFT JOIN p.category c
       WHERE o.scheduledDate BETWEEN :startDate AND :endDate
       AND o.type = br.ufsc.abm.model.enums.OrderTypeEnum.MATERIAL
       GROUP BY p.id, p.name, c.name
       ORDER BY SUM(o.orderValue) DESC
       """)
	List<ProductBalanceDTO> findProductBalanceSummary(
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate
	);

	@Query("""
    SELECT new br.ufsc.abm.model.dto.MonthlySalesDTO(
        MONTH(o.scheduledDate),
        SUM(o.orderValue)
    )
    FROM Order o
    WHERE o.scheduledDate BETWEEN :startDate AND :endDate
    GROUP BY MONTH(o.scheduledDate)
    """)
	List<MonthlySalesDTO> findMonthlySales(
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate
	);
}

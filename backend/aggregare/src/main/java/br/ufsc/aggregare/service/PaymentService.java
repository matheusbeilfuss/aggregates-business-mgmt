package br.ufsc.aggregare.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.Payment;
import br.ufsc.aggregare.model.dto.PaymentInputDTO;
import br.ufsc.aggregare.model.dto.PaymentInsertDTO;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;
import br.ufsc.aggregare.repository.OrderRepository;
import br.ufsc.aggregare.repository.PaymentRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {

	private final PaymentRepository paymentRepository;
	private final OrderRepository orderRepository;

	@Autowired
	public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
		this.paymentRepository = paymentRepository;
		this.orderRepository = orderRepository;
	}

	@Transactional
	public Payment insert(PaymentInsertDTO dto) {
		Order existingOrder = orderRepository.findById(dto.getOrderId())
				.orElseThrow(() -> new ResourceNotFoundException(dto.getOrderId()));

		Payment payment = buildPayment(dto, existingOrder);

		Payment savedPayment = paymentRepository.save(payment);
		updateOrderPaymentState(existingOrder);
		return savedPayment;
	}

	@Transactional
	public Payment update(Long id, PaymentInputDTO dto) {
		Payment existingPayment = paymentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		applyDTO(existingPayment, dto);

		Payment savedPayment = paymentRepository.save(existingPayment);
		updateOrderPaymentState(savedPayment.getOrder());
		return savedPayment;
	}

	@Transactional
	public void delete(Long id) {
		Payment existingPayment = paymentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
		Order order = existingPayment.getOrder();

		paymentRepository.delete(existingPayment);
		paymentRepository.flush();

		updateOrderPaymentState(order);
	}

	private Payment buildPayment(PaymentInputDTO dto, Order order) {
		Payment payment = new Payment();
		payment.setOrder(order);
		applyDTO(payment, dto);
		return payment;
	}

	private void applyDTO(Payment payment, PaymentInputDTO dto) {
		payment.setPaymentValue(dto.getPaymentValue());
		payment.setPaymentMethod(dto.getPaymentMethod());
		payment.setDate(dto.getDate());
	}

	public void updateOrderPaymentState(Order order) {
		BigDecimal totalPaid = findByOrderId(order.getId()).stream()
				.map(Payment::getPaymentValue)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal remaining = order.getOrderValue().subtract(totalPaid).max(BigDecimal.ZERO);

		if (totalPaid.compareTo(order.getOrderValue()) >= 0) {
			order.setPaymentStatus(PaymentStatusEnum.PAID);
		} else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
			order.setPaymentStatus(PaymentStatusEnum.PARTIAL);
		} else {
			order.setPaymentStatus(PaymentStatusEnum.PENDING);
		}

		order.setRemainingValue(remaining);
		orderRepository.save(order);
	}

	public Payment findById(Long id) {
		return paymentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Payment> findAll() {
		return paymentRepository.findAll();
	}

	public List<Payment> findByOrderId(Long orderId) {
		return paymentRepository.findByOrderId(orderId);
	}

	public List<Payment> findByPeriod(LocalDate startDate, LocalDate endDate) {
		return paymentRepository.findByDateBetween(startDate, endDate);
	}
}

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
import br.ufsc.aggregare.model.enums.PaymentMethodEnum;
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
	public Payment insert(Payment payment) {
		Payment savedPayment = paymentRepository.save(payment);
		recalculateOrderPaymentStatus(payment.getOrder());
		return savedPayment;
	}

	@Transactional
	public Payment insert(Order order, BigDecimal paymentValue, PaymentMethodEnum paymentMethod) {
		Payment newPayment = new Payment();
		newPayment.setOrder(order);
		newPayment.setDate(LocalDate.now());
		newPayment.setPaymentValue(paymentValue);
		newPayment.setPaymentMethod(paymentMethod);

		return insert(newPayment);
	}

	@Transactional
	public Payment insert(PaymentInsertDTO dto) {
		Order existingOrder = orderRepository.findById(dto.getOrderId())
				.orElseThrow(() -> new ResourceNotFoundException(dto.getOrderId()));

		return insert(existingOrder, dto.getPaymentValue(), dto.getPaymentMethod());
	}

	private void recalculateOrderPaymentStatus(Order order) {
		List<Payment> payments = findByOrderId(order.getId());

		BigDecimal totalPaid = payments.stream()
				.map(Payment::getPaymentValue)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		if (totalPaid.compareTo(order.getOrderValue()) >= 0) {
			order.setPaymentStatus(PaymentStatusEnum.PAID);
		} else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
			order.setPaymentStatus(PaymentStatusEnum.PARTIAL);
		} else {
			order.setPaymentStatus(PaymentStatusEnum.PENDING);
		}

		orderRepository.save(order);
	}

	@Transactional
	public void delete(Long id) {
		Payment existingPayment = paymentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
		Order order = existingPayment.getOrder();

		paymentRepository.delete(existingPayment);
		paymentRepository.flush();

		recalculateOrderPaymentStatus(order);
	}

	@Transactional
	public Payment update(Long id, PaymentInsertDTO dto) {
		Payment existingPayment = paymentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		existingPayment.setPaymentValue(dto.getPaymentValue());
		existingPayment.setPaymentMethod(dto.getPaymentMethod());

		Payment savedPayment = paymentRepository.save(existingPayment);

		recalculateOrderPaymentStatus(savedPayment.getOrder());

		return savedPayment;
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
}

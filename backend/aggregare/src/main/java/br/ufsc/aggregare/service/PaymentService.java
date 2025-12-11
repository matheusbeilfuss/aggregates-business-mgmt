package br.ufsc.aggregare.service;

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
	public Payment insert(Payment payment) {
		Payment savedPayment = paymentRepository.save(payment);
		recalculateOrderPaymentStatus(payment.getOrder());
		return savedPayment;
	}

	@Transactional
	public Payment insert(PaymentInsertDTO dto) {
		Payment payment = fromInsertDTO(dto);
		paymentRepository.save(payment);
		recalculateOrderPaymentStatus(payment.getOrder());
		return payment;
	}

	private Payment fromInsertDTO(PaymentInsertDTO dto) {
		Order existingOrder = orderRepository.findById(dto.getOrderId())
				.orElseThrow(() -> new ResourceNotFoundException(dto.getOrderId()));

		Payment newPayment = new Payment();
		newPayment.setOrder(existingOrder);
		newPayment.setDate(LocalDate.now());
		newPayment.setPaymentValue(dto.getPaymentValue());
		newPayment.setPaymentMethod(dto.getPaymentMethod());

		return newPayment;
	}

	public Boolean isPaymentComplete(Order order, Payment newPayment) {
		List<Payment> payments = findByOrderId(order.getId());
		Double totalPaid = payments.stream().mapToDouble(Payment::getPaymentValue).sum() + newPayment.getPaymentValue();
		return totalPaid >= order.getOrderValue();
	}

	private void recalculateOrderPaymentStatus(Order order) {
		List<Payment> payments = findByOrderId(order.getId());
		Double totalPaid = payments.stream().mapToDouble(Payment::getPaymentValue).sum();

		if (totalPaid >= order.getOrderValue()) {
			order.setPaymentStatus(PaymentStatusEnum.PAID);
		} else if (totalPaid > 0.0) {
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

	public List<Payment> findByOrderId(Long orderId) {
		return paymentRepository.findByOrderId(orderId);
	}
}

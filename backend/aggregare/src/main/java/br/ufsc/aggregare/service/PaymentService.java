package br.ufsc.aggregare.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.Payment;
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
		return paymentRepository.save(payment);
	}

	@Transactional
	public Payment insert(PaymentInsertDTO dto) {
		Payment payment = fromInsertDTO(dto);
		return paymentRepository.save(payment);
	}

	private Payment fromInsertDTO(PaymentInsertDTO dto) {
		Order existingOrder = orderRepository.findById(dto.getOrderId())
				.orElseThrow(() -> new ResourceNotFoundException(dto.getOrderId()));

		Payment newPayment = new Payment();
		newPayment.setOrder(existingOrder);
		newPayment.setDate(LocalDate.now());
		newPayment.setPaymentValue(dto.getPaymentValue());
		newPayment.setPaymentMethod(dto.getPaymentMethod());

		if (isPaymentComplete(existingOrder, newPayment)) {
			existingOrder.setPaymentStatus(PaymentStatusEnum.PAID);
		} else {
			existingOrder.setPaymentStatus(PaymentStatusEnum.PARTIAL);
		}
		return newPayment;
	}

	public Boolean isPaymentComplete(Order order, Payment newPayment) {
		List<Payment> payments = findByOrderId(order.getId());
		Double totalPaid = payments.stream().mapToDouble(Payment::getPaymentValue).sum() + newPayment.getPaymentValue();
		return totalPaid >= order.getOrderValue();
	}

	public List<Payment> findByOrderId(Long orderId) {
		return paymentRepository.findByOrderId(orderId);
	}
}

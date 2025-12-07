package br.ufsc.aggregare.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Payment;
import br.ufsc.aggregare.repository.PaymentRepository;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {

	private final PaymentRepository paymentRepository;

	@Autowired
	public PaymentService(PaymentRepository paymentRepository) {
		this.paymentRepository = paymentRepository;
	}

	@Transactional
	public Payment insert(Payment payment) {
		return paymentRepository.save(payment);
	}

	public List<Payment> findByOrderId(Long orderId) {
		return paymentRepository.findByOrderId(orderId);
	}
}

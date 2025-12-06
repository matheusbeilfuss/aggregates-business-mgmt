package br.ufsc.aggregare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufsc.aggregare.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}

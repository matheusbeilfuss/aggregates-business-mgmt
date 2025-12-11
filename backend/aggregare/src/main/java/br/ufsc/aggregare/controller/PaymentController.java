package br.ufsc.aggregare.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Payment;
import br.ufsc.aggregare.model.dto.PaymentInsertDTO;
import br.ufsc.aggregare.service.PaymentService;

@RestController
@RequestMapping(value = "/payments")
public class PaymentController {

	private final PaymentService service;

	@Autowired
	public PaymentController(PaymentService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Payment> insert(@RequestBody PaymentInsertDTO dto) {
		Payment payment = service.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(payment.getId()).toUri();
		return ResponseEntity.created(uri).body(payment);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
}

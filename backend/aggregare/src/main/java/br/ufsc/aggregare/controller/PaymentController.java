package br.ufsc.aggregare.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Payment;
import br.ufsc.aggregare.model.dto.PaymentInputDTO;
import br.ufsc.aggregare.model.dto.PaymentInsertDTO;
import br.ufsc.aggregare.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/payments")
public class PaymentController {

	private final PaymentService service;

	@Autowired
	public PaymentController(PaymentService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Payment> insert(@RequestBody @Valid PaymentInsertDTO dto) {
		Payment payment = service.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(payment.getId()).toUri();
		return ResponseEntity.created(uri).body(payment);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Payment> update(@PathVariable Long id, @RequestBody @Valid PaymentInputDTO dto) {
		Payment payment = service.update(id, dto);
		return ResponseEntity.ok().body(payment);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Payment> findById(@PathVariable Long id) {
		Payment payment = service.findById(id);
		return ResponseEntity.ok().body(payment);
	}

	@GetMapping
	public ResponseEntity<List<Payment>> findAll(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate) {
		if ((startDate == null) != (endDate == null)) {
			throw new IllegalArgumentException("As datas de início e fim do período devem ser informadas juntas");
		}


		List<Payment> payments = (startDate != null)
				? service.findByPeriod(startDate, endDate)
				: service.findAll();

		return ResponseEntity.ok().body(payments);
	}
}

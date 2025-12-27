package br.ufsc.aggregare.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.dto.OrderInputDTO;
import br.ufsc.aggregare.model.dto.PaymentInputDTO;
import br.ufsc.aggregare.service.OrderService;

@RestController
@RequestMapping(value = "/orders")
public class OrderController {

	private final OrderService service;

	@Autowired
	public OrderController(OrderService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Order> insert(@RequestBody OrderInputDTO dto) {
		Order order = service.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(order.getId()).toUri();
		return ResponseEntity.created(uri).body(order);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody OrderInputDTO dto) {
		Order order = service.update(id, dto);
		return ResponseEntity.ok().body(order);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Order> findById(@PathVariable Long id) {
		Order order = service.findById(id);
		return ResponseEntity.ok().body(order);
	}

	@GetMapping
	public ResponseEntity<List<Order>> findAll() {
		List<Order> orders = service.findAll();
		return ResponseEntity.ok().body(orders);
	}

	@PatchMapping(value = "/{id}/pay")
	public ResponseEntity<Order> payOrder(@PathVariable Long id, @RequestBody PaymentInputDTO payment) {
		Order order = service.createPayment(id, payment);
		return ResponseEntity.ok().body(order);
	}
}

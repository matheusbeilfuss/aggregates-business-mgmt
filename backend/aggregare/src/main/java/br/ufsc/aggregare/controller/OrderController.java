package br.ufsc.aggregare.controller;

import java.net.URI;
import java.time.LocalDate;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.dto.OrderInputDTO;
import br.ufsc.aggregare.model.dto.ProductBalanceDTO;
import br.ufsc.aggregare.model.dto.ReceivableDTO;
import br.ufsc.aggregare.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/orders")
public class OrderController {

	private final OrderService service;

	@Autowired
	public OrderController(OrderService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Order> insert(@RequestBody @Valid OrderInputDTO dto) {
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
	public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody @Valid OrderInputDTO dto) {
		Order order = service.update(id, dto);
		return ResponseEntity.ok().body(order);
	}

	@PatchMapping(value = "/{id}/delivered")
	public ResponseEntity<Order> markAsDelivered(@PathVariable Long id) {
		Order order = service.markAsDelivered(id);
		return ResponseEntity.ok().body(order);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Order> findById(@PathVariable Long id) {
		Order order = service.findById(id);
		return ResponseEntity.ok().body(order);
	}

	@GetMapping
	public ResponseEntity<List<Order>> findAll(@RequestParam(value = "scheduledDate", required = false) LocalDate scheduledDate) {
		List<Order> orders;

		if (scheduledDate != null) {
			orders = service.findByScheduledDate(scheduledDate);
		} else {
			orders = service.findAll();
		}

		return ResponseEntity.ok().body(orders);
	}

	@GetMapping("/receivables")
	public ResponseEntity<List<ReceivableDTO>> findReceivables(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate) {
		if ((startDate == null) != (endDate == null)) {
			throw new IllegalArgumentException("As datas de início e fim do período devem ser informadas juntas");
		}

		return ResponseEntity.ok(service.findReceivables(startDate, endDate));
	}

	@GetMapping("/balance-by-product")
	public ResponseEntity<List<ProductBalanceDTO>> getBalanceByProduct(
			@RequestParam LocalDate startDate,
			@RequestParam LocalDate endDate
	) {
		return ResponseEntity.ok(service.getBalanceByProduct(startDate, endDate));
	}
}

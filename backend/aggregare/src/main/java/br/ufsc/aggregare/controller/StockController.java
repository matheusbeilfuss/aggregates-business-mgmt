package br.ufsc.aggregare.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufsc.aggregare.model.Stock;
import br.ufsc.aggregare.model.dto.StockReplenishDTO;
import br.ufsc.aggregare.model.dto.StockUpdateDTO;
import br.ufsc.aggregare.service.StockService;

@RestController
@RequestMapping(value = "/stocks")
public class StockController {

	private final StockService service;

	@Autowired
	public StockController(StockService service) {
		this.service = service;
	}

	@PostMapping(value = "/{productId}/replenish")
	public ResponseEntity<Stock> replenishStock(@PathVariable Long productId, @RequestBody StockReplenishDTO dto) {
		Stock stock = service.replenishStock(productId, dto);
		return ResponseEntity.ok().body(stock);
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Stock> update(@PathVariable Long id, @RequestBody StockUpdateDTO dto) {
		Stock stock = service.fromDTO(dto);
		stock = service.update(id, stock);
		return ResponseEntity.ok().body(stock);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Stock> findById(@PathVariable Long id) {
		Stock stock = service.findById(id);
		return ResponseEntity.ok().body(stock);
	}

	@GetMapping
	public ResponseEntity<List<Stock>> findAll() {
		List<Stock> stocks = service.findAll();
		return ResponseEntity.ok().body(stocks);
	}
}

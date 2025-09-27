package br.ufsc.aggregare.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufsc.aggregare.model.Price;
import br.ufsc.aggregare.service.PriceService;

@RestController
@RequestMapping(value = "/prices")
public class PriceController {

	private final PriceService service;

	@Autowired
	public PriceController(PriceService service) {
		this.service = service;
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Price> findById(@PathVariable Long id) {
		Price price = service.findById(id);
		return ResponseEntity.ok().body(price);
	}

	@GetMapping
	public ResponseEntity<List<Price>> findAll() {
		List<Price> prices = service.findAll();
		return ResponseEntity.ok().body(prices);
	}
}

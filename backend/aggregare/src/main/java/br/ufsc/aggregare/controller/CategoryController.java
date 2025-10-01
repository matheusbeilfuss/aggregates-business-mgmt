package br.ufsc.aggregare.controller;

import java.net.URI;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.model.dto.PriceDTO;
import br.ufsc.aggregare.service.CategoryService;
import br.ufsc.aggregare.service.PriceService;

@RestController
@RequestMapping(value = "/categories")
public class CategoryController {

	private final CategoryService service;
	private final PriceService priceService;

	@Autowired
	public CategoryController(CategoryService service, PriceService priceService) {
		this.service = service;
		this.priceService = priceService;
	}

	@PostMapping
	public ResponseEntity<Category> insert(@RequestBody Category category) {
		category = service.insert(category);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(category.getId()).toUri();
		return ResponseEntity.created(uri).body(category);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category category) {
		category = service.update(id, category);
		return ResponseEntity.ok().body(category);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Category> findById(@PathVariable Long id) {
		Category category = service.findById(id);
		return ResponseEntity.ok().body(category);
	}

	@GetMapping
	public ResponseEntity<List<Category>> findAll() {
		List<Category> categories = service.findAll();
		return ResponseEntity.ok().body(categories);
	}

	@GetMapping(value = "/{id}/prices")
	public ResponseEntity<List<PriceDTO>> findPricesByCategoryId(@PathVariable Long id) {
		List<PriceDTO> prices = priceService.findPricesByCategoryId(id);
		return ResponseEntity.ok().body(prices);
	}

	@PutMapping(value = "/{id}/prices")
	public ResponseEntity<List<PriceDTO>> updatePricesForCategory(@PathVariable Long id, @RequestBody List<PriceDTO> prices) {
		List<PriceDTO> updatedPrices = priceService.updatePricesForCategory(id, prices);
		return ResponseEntity.ok().body(updatedPrices);
	}
}

package br.ufsc.aggregare.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.dto.ProductInsertDTO;
import br.ufsc.aggregare.service.ProductService;

@RestController
@RequestMapping(value = "/products")
public class ProductController {

	private final ProductService service;

	@Autowired
	public ProductController(ProductService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Product> insert(@RequestBody ProductInsertDTO dto) {
		Product product = service.fromDTO(dto);
		product = service.insert(product);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(product.getId()).toUri();
		return ResponseEntity.created(uri).body(product);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody ProductInsertDTO dto) {
		Product product = service.fromDTO(dto);
		System.out.println("PRODUCT" + product);
		product = service.update(id, product);
		return ResponseEntity.ok().body(product);
	}
}

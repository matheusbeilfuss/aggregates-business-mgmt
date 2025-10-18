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

import br.ufsc.aggregare.model.dto.ProductSupplierDTO;
import br.ufsc.aggregare.model.dto.ProductSupplierInputDTO;
import br.ufsc.aggregare.service.ProductSupplierService;

@RestController
@RequestMapping(value = "/product-suppliers")
public class ProductSupplierController {

	private final ProductSupplierService service;

	@Autowired
	public ProductSupplierController(ProductSupplierService service) {
		this.service = service;
	}

	@GetMapping("/{productId}")
	public ResponseEntity<List<ProductSupplierDTO>> findSupplierByProductId(@PathVariable Long productId) {
		List<ProductSupplierDTO> suppliers = service.findSupplierByProductId(productId);
		return ResponseEntity.ok().body(suppliers);
	}

	@PostMapping
	public ResponseEntity<ProductSupplierDTO> insert(@RequestBody ProductSupplierInputDTO productSupplier) {
		ProductSupplierDTO newProductSupplier = service.insert(productSupplier);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newProductSupplier.getId()).toUri();
		return ResponseEntity.created(uri).body(newProductSupplier);
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<ProductSupplierDTO> update(@PathVariable Long id, @RequestBody ProductSupplierInputDTO dto) {
		ProductSupplierDTO updatedProductSupplier = service.update(id, dto);
		return ResponseEntity.ok().body(updatedProductSupplier);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
}

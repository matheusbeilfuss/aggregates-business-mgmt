package br.ufsc.aggregare.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufsc.aggregare.model.Client;
import br.ufsc.aggregare.model.dto.ClientDTO;
import br.ufsc.aggregare.model.dto.ClientInputDTO;
import br.ufsc.aggregare.service.ClientService;

@RestController
@RequestMapping(value = "/clients")
public class ClientController {

	private final ClientService service;

	@Autowired
	public ClientController(ClientService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Client> insert(@RequestBody ClientInputDTO dto) {
		Client client = service.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(client.getId()).toUri();
		return ResponseEntity.created(uri).body(client);
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<ClientDTO> findById(@PathVariable Long id) {
		ClientDTO client = service.findById(id);
		return ResponseEntity.ok().body(client);
	}

	@GetMapping
	public ResponseEntity<List<Client>> findAll() {
		List<Client> clients = service.findAll();
		return ResponseEntity.ok().body(clients);
	}
}

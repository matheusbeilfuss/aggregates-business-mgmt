package br.ufsc.aggregare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufsc.aggregare.model.Settings;
import br.ufsc.aggregare.model.dto.SettingsDTO;
import br.ufsc.aggregare.service.SettingsService;

@RestController
@RequestMapping("/settings")
public class SettingsController {

	private final SettingsService service;

	@Autowired
	public SettingsController(SettingsService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<SettingsDTO> find() {
		Settings settings = service.find();
		return ResponseEntity.ok(new SettingsDTO(settings.getBusinessName()));
	}

	@PutMapping
	public ResponseEntity<SettingsDTO> update(@RequestBody SettingsDTO dto) {
		Settings settings = service.update(dto);
		return ResponseEntity.ok(new SettingsDTO(settings.getBusinessName()));
	}
}

package br.ufsc.aggregare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Settings;
import br.ufsc.aggregare.model.dto.SettingsDTO;
import br.ufsc.aggregare.repository.SettingsRepository;

@Service
public class SettingsService {

	private final SettingsRepository repository;

	@Autowired
	public SettingsService(SettingsRepository repository) {
		this.repository = repository;
	}

	public Settings find() {
		return repository.findById(1L).orElseGet(() -> {
			Settings defaults = new Settings("Nome do Comércio");
			return repository.save(defaults);
		});
	}

	public Settings update(SettingsDTO dto) {
		Settings settings = find();
		settings.setBusinessName(dto.getBusinessName());
		return repository.save(settings);
	}
}

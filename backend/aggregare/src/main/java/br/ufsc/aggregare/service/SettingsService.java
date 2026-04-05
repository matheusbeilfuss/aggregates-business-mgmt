package br.ufsc.aggregare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.ufsc.aggregare.model.Settings;
import br.ufsc.aggregare.model.dto.SettingsDTO;
import br.ufsc.aggregare.repository.SettingsRepository;
import br.ufsc.aggregare.service.exception.FileStorageException;

@Service
public class SettingsService {

	private static final Logger LOGGER = LoggerFactory.getLogger(SettingsService.class);

	private final SettingsRepository repository;
	private final FileService fileService;

	@Autowired
	public SettingsService(SettingsRepository repository, FileService fileService) {
		this.repository = repository;
		this.fileService = fileService;
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

	public Settings updateBusinessImage(MultipartFile image) {
		Settings settings = find();

		if (image != null && !image.isEmpty()) {
			String oldImg = settings.getBusinessImgName();
			String newImg = fileService.saveImage(image);
			settings.setBusinessImgName(newImg);
			repository.save(settings);

			if (oldImg != null && !oldImg.isEmpty()) {
				try {
					fileService.deleteImage(oldImg);
				} catch (FileStorageException e) {
					LOGGER.warn("Não foi possível deletar imagem antiga: {}", oldImg, e);
				}
			}
		}

		return settings;
	}

	public Settings deleteBusinessImage() {
		Settings settings = find();
		String oldImg = settings.getBusinessImgName();

		if (oldImg != null && !oldImg.isEmpty()) {
			settings.setBusinessImgName(null);
			repository.save(settings);

			try {
				fileService.deleteImage(oldImg);
			} catch (FileStorageException e) {
				LOGGER.warn("Não foi possível deletar imagem: {}", oldImg, e);
			}
		}

		return settings;
	}
}

package br.ufsc.abm.controller;

import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.ufsc.abm.model.Settings;
import br.ufsc.abm.model.dto.SettingsDTO;
import br.ufsc.abm.service.FileService;
import br.ufsc.abm.service.SettingsService;
import br.ufsc.abm.service.exception.FileStorageException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/settings")
public class SettingsController {

	private final SettingsService service;
	private final FileService fileService;

	@Autowired
	public SettingsController(SettingsService service, FileService fileService) {
		this.service = service;
		this.fileService = fileService;
	}

	@GetMapping
	public ResponseEntity<SettingsDTO> find() {
		Settings settings = service.find();
		return ResponseEntity.ok(new SettingsDTO(settings.getBusinessName(), settings.getBusinessImgName()));
	}

	@PutMapping
	public ResponseEntity<SettingsDTO> update(@RequestBody @Valid SettingsDTO dto) {
		Settings settings = service.update(dto);
		return ResponseEntity.ok(new SettingsDTO(settings.getBusinessName(), settings.getBusinessImgName()));
	}

	@GetMapping("/business-image")
	public ResponseEntity<Resource> findBusinessImage() {
		Settings settings = service.find();
		String imgName = settings.getBusinessImgName();

		if (imgName == null || imgName.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		Path filePath = fileService.getFilePath(imgName);

		try {
			Resource resource = fileService.loadFileAsResource(filePath);
			long lastModified = filePath.toFile().lastModified();

			return ResponseEntity.ok()
					.contentType(fileService.getFileMediaType(filePath))
					.cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic())
					.lastModified(lastModified)
					.eTag("\"" + imgName + "\"")
					.body(resource);
		} catch (FileStorageException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@PatchMapping(value = "/business-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<SettingsDTO> updateBusinessImage(@RequestPart("image") MultipartFile image) {
		Settings settings = service.updateBusinessImage(image);
		return ResponseEntity.ok(new SettingsDTO(settings.getBusinessName(), settings.getBusinessImgName()));
	}

	@DeleteMapping("/business-image")
	public ResponseEntity<SettingsDTO> deleteBusinessImage() {
		Settings settings = service.deleteBusinessImage();
		return ResponseEntity.ok(new SettingsDTO(settings.getBusinessName(), settings.getBusinessImgName()));
	}
}

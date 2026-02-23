package br.ufsc.aggregare.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.ufsc.aggregare.service.exception.FileStorageException;

@Service
public class FileService {

	private final Path uploadPath = Paths.get("uploads");

	public String saveImage(MultipartFile file) {
		if (file.isEmpty()) {
			throw new FileStorageException("Failed to save empty file.");
		}

		try {
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			String originalFileName = file.getOriginalFilename();
			String extension = "";

			if (originalFileName != null) {
				int dotIndex = originalFileName.lastIndexOf('.');
				if (dotIndex > 0) {
					extension = originalFileName.substring(dotIndex);
				}
			}

			String uniqueFileName = UUID.randomUUID() + extension;
			Path filePath = this.uploadPath.resolve(uniqueFileName);

			Files.copy(file.getInputStream(), filePath);

			return uniqueFileName;
		} catch (IOException e) {
			throw new FileStorageException("Failed to save file: " + file.getOriginalFilename());
		}
	}

	public void deleteImage(String imgName) {
		if (imgName != null && !imgName.isEmpty()) {
			try {
				Path filePath = this.uploadPath.resolve(imgName);
				Files.deleteIfExists(filePath);
			} catch (IOException e) {
				throw new FileStorageException("Failed to delete previous image: " + imgName);
			}
		}
	}

	public Path getFilePath(String imgName) {
		if (imgName != null && !imgName.isEmpty()) {
			return this.uploadPath.resolve(imgName);
		}
		return null;
	}

	public Resource loadFileAsResource(Path filePath) {
		try {
			Resource resource = new UrlResource(filePath.toUri());

			if (!resource.exists() || !resource.isReadable()) {
				throw new FileStorageException("File not found or not readable");
			}

			return resource;
		} catch (IOException e) {
			throw new FileStorageException("Failed to load file as resource");
		}
	}

	public MediaType getFileMediaType(Path filePath) {
		try {
			String contentType = Files.probeContentType(filePath);

			if (contentType == null) {
				return MediaType.APPLICATION_OCTET_STREAM;
			}

			return MediaType.parseMediaType(contentType);
		} catch (IOException e) {
			return MediaType.APPLICATION_OCTET_STREAM;
		}
	}
}

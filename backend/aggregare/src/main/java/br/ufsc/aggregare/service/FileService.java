package br.ufsc.aggregare.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.ufsc.aggregare.service.exception.FileStorageException;

@Service
public class FileService {

	private final Path uploadPath = Paths.get("uploads");

	public String saveImage(MultipartFile file) {
		if (file.isEmpty()) {
			throw new FileStorageException("Falha ao salvar arquivo vazio.");
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

			return "/uploads/" + uniqueFileName;
		} catch (IOException e) {
			throw new FileStorageException("Failed to save file: " + file.getOriginalFilename());
		}
	}

	public void deleteImage(String imgUrl) {
		if (imgUrl != null && !imgUrl.isEmpty()) {
			try {
				String filename = imgUrl.replace("/uploads/", "");
				Path filePath = this.uploadPath.resolve(filename);
				Files.deleteIfExists(filePath);
			} catch (IOException e) {
				throw new FileStorageException("Failed to delete previous image: " + imgUrl);
			}
		}
	}
}

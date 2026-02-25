package br.ufsc.aggregare.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.ufsc.aggregare.service.exception.FileStorageException;

import net.coobird.thumbnailator.Thumbnails;

@Service
public class FileService {

	private static final int MAX_DIMENSION = 800;
	private static final double COMPRESSION_QUALITY = 0.8;
	private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
			"image/jpeg", "image/png", "image/webp"
	);

	private final Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();

	private Path resolveAndValidate(String imgName) {
		Path resolved = uploadPath.resolve(imgName).normalize();

		if (!resolved.startsWith(uploadPath)) {
			throw new FileStorageException("Caminho de arquivo inválido.");
		}

		return resolved;
	}

	public String saveImage(MultipartFile file) {
		if (file.isEmpty()) {
			throw new FileStorageException("Não é permitido salvar um arquivo vazio.");
		}

		String contentType = file.getContentType();
		if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
			throw new FileStorageException("Tipo de arquivo não permitido. Envie uma imagem JPEG, PNG, GIF ou WebP.");
		}

		try {
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			String uniqueFileName = UUID.randomUUID() + ".jpg";
			Path filePath = resolveAndValidate(uniqueFileName);

			Thumbnails.of(file.getInputStream())
					.size(MAX_DIMENSION, MAX_DIMENSION)
					.outputFormat("jpg")
					.outputQuality(COMPRESSION_QUALITY)
					.toFile(filePath.toFile());

			return uniqueFileName;
		} catch (IOException e) {
			throw new FileStorageException("Não foi possível salvar o arquivo: " + file.getOriginalFilename());
		}
	}

	public void deleteImage(String imgName) {
		if (imgName != null && !imgName.isEmpty()) {
			try {
				Path filePath = resolveAndValidate(imgName);
				Files.deleteIfExists(filePath);
			} catch (IOException e) {
				throw new FileStorageException("Não foi possível deletar imagem anterior: " + imgName);
			}
		}
	}

	public Path getFilePath(String imgName) {
		if (imgName != null && !imgName.isEmpty()) {
			return resolveAndValidate(imgName);
		}
		return null;
	}

	public Resource loadFileAsResource(Path filePath) {
		try {
			Resource resource = new UrlResource(filePath.toUri());

			if (!resource.exists() || !resource.isReadable()) {
				throw new FileStorageException("Arquivo não encontrado ou não é legível");
			}

			return resource;
		} catch (IOException e) {
			throw new FileStorageException("Não foi possível carregar o arquivo");
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

package br.ufsc.aggregare.service.exception;

import java.io.Serial;

public class FileStorageException extends RuntimeException {

	@Serial private static final long serialVersionUID = 1L;

	public FileStorageException(String message) {
		super(message);
	}
}

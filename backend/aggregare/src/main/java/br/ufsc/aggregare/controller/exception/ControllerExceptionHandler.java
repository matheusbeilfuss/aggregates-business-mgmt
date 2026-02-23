package br.ufsc.aggregare.controller.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import br.ufsc.aggregare.security.exception.LoginException;
import br.ufsc.aggregare.security.exception.TokenException;
import br.ufsc.aggregare.service.exception.FileStorageException;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class ControllerExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request) {
		String error = "Resource not found";
		HttpStatus status = HttpStatus.NOT_FOUND;
		StandardError err = new StandardError(Instant.now(), status.value(), error, e.getMessage(), request.getRequestURI());
		return ResponseEntity.status(status).body(err);
	}

	@ExceptionHandler(FileStorageException.class)
	public ResponseEntity<StandardError> emptyUploadedFile(FileStorageException e, HttpServletRequest request) {
		String error = "Empty uploaded file";
		HttpStatus status = HttpStatus.BAD_REQUEST;
		StandardError err = new StandardError(Instant.now(), status.value(), error, e.getMessage(), request.getRequestURI());
		return ResponseEntity.status(status).body(err);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<StandardError> maxUploadSizeExceeded(MaxUploadSizeExceededException e, HttpServletRequest request) {
		String error = "Arquivo muito grande";
		String message = "O arquivo enviado excede o limite máximo permitido. Por favor, envie um arquivo menor.";
		HttpStatus status = HttpStatus.BAD_REQUEST;
		StandardError err = new StandardError(Instant.now(), status.value(), error, message, request.getRequestURI());
		return ResponseEntity.status(status).body(err);
	}

	@ExceptionHandler(TokenException.class)
	public ResponseEntity<StandardError> tokenError(TokenException e, HttpServletRequest request) {
		String error = "Authentication error";
		HttpStatus status = HttpStatus.UNAUTHORIZED;
		StandardError err = new StandardError(Instant.now(), status.value(), error, e.getMessage(), request.getRequestURI());
		return ResponseEntity.status(status).body(err);
	}

	@ExceptionHandler(LoginException.class)
	public ResponseEntity<StandardError> loginError(LoginException e, HttpServletRequest request) {
		String error = "Login error";
		HttpStatus status = HttpStatus.UNAUTHORIZED;
		StandardError err = new StandardError(Instant.now(), status.value(), error, e.getMessage(), request.getRequestURI());
		return ResponseEntity.status(status).body(err);
	}
}

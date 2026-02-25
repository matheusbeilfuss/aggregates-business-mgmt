package br.ufsc.aggregare.security.exception;

import java.io.Serial;

import org.springframework.security.core.AuthenticationException;

public class TokenException extends AuthenticationException {

	@Serial private static final long serialVersionUID = 1L;

	public TokenException(String message) {
		super(message);
	}

	public TokenException(String message, Throwable cause) {
		super(message, cause);
	}
}

package br.ufsc.aggregare.security.exception;

import java.io.Serial;

import org.springframework.security.core.AuthenticationException;

public class LoginException extends AuthenticationException {

	@Serial private static final long serialVersionUID = 1L;

	public LoginException(String message) {
		super(message);
	}
}

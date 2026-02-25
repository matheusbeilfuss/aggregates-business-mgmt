package br.ufsc.aggregare.controller;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.model.dto.AuthenticationDTO;
import br.ufsc.aggregare.security.LoginAttemptService;
import br.ufsc.aggregare.security.TokenService;
import br.ufsc.aggregare.security.exception.LoginException;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
public class AuthenticationController {

	private static final String COOKIE_NAME = "auth_token";

	@Value("${api.security.cookie.secure}")
	private boolean cookieSecure;

	private final AuthenticationManager authenticationManager;
	private final TokenService tokenService;
	private final LoginAttemptService loginAttemptService;

	@Autowired
	public AuthenticationController(AuthenticationManager authenticationManager, TokenService tokenService, LoginAttemptService loginAttemptService) {
		this.authenticationManager = authenticationManager;
		this.tokenService = tokenService;
		this.loginAttemptService = loginAttemptService;
	}

	@PostMapping("/login")
	public ResponseEntity<Void> login(@Valid @RequestBody AuthenticationDTO authDTO, HttpServletResponse response) {
		String username = authDTO.username();

		if (loginAttemptService.isBlocked(username)) {
			throw new LoginException("Múltiplas tentativas inválidas. Tente novamente mais tarde.");
		}

		try {
			var tokenAuth = new UsernamePasswordAuthenticationToken(username, authDTO.password());
			var auth = authenticationManager.authenticate(tokenAuth);

			loginAttemptService.loginSucceeded(username);

			var token = tokenService.generateToken((User) auth.getPrincipal());
			response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(token, tokenService.getExpiration()).toString());

			return ResponseEntity.ok().build();
		} catch (BadCredentialsException e) {
			loginAttemptService.loginFailed(username);

			int remainingAttempts = loginAttemptService.getRemainingAttempts(username);

			if (remainingAttempts > 0) {
				throw new LoginException("Falha no login. Verifique suas credenciais.");
			} else {
				throw new LoginException("Múltiplas tentativas inválidas. Tente novamente mais tarde.");
			}
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletResponse response) {
		response.addHeader(HttpHeaders.SET_COOKIE, buildCookie("", Duration.ZERO).toString());
		return ResponseEntity.ok().build();
	}

	private ResponseCookie buildCookie(String value, Duration maxAge) {
		return ResponseCookie.from(COOKIE_NAME, value)
				.httpOnly(true)
				.secure(cookieSecure)
				.sameSite("Strict")
				.path("/")
				.maxAge(maxAge)
				.build();
	}
}

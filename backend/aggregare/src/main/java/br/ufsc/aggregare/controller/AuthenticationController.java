package br.ufsc.aggregare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.model.dto.AuthenticationDTO;
import br.ufsc.aggregare.model.dto.LoginResponseDTO;
import br.ufsc.aggregare.security.LoginAttemptService;
import br.ufsc.aggregare.security.TokenService;
import br.ufsc.aggregare.security.exception.LoginException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/login")
public class AuthenticationController {

	private final AuthenticationManager authenticationManager;
	private final TokenService tokenService;
	private final LoginAttemptService loginAttemptService;

	@Autowired
	public AuthenticationController(AuthenticationManager authenticationManager, TokenService tokenService, LoginAttemptService loginAttemptService) {
		this.authenticationManager = authenticationManager;
		this.tokenService = tokenService;
		this.loginAttemptService = loginAttemptService;
	}

	@PostMapping
	public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody AuthenticationDTO authDTO, HttpServletRequest request) {
		String username = authDTO.username();
		String ip = request.getRemoteAddr();

		if (loginAttemptService.isBlocked(username, ip)) {
			throw new LoginException("Múltiplas tentativas inválidas. Tente novamente mais tarde.");
		}

		try {
			var tokenAuth = new UsernamePasswordAuthenticationToken(username, authDTO.password());
			var auth = authenticationManager.authenticate(tokenAuth);

			loginAttemptService.loginSucceeded(username, ip);

			var token = tokenService.generateToken((User) auth.getPrincipal());
			return ResponseEntity.ok(new LoginResponseDTO(token));
		} catch (BadCredentialsException e) {
			loginAttemptService.loginFailed(username, ip);

			int remainingAttempts = loginAttemptService.getRemainingAttempts(authDTO.username());

			if (remainingAttempts > 0) {
				throw new LoginException("Falha no login. Verifique suas credenciais.");
			} else {
				throw new LoginException("Múltiplas tentativas inválidas. Tente novamente mais tarde.");
			}
		}
	}
}

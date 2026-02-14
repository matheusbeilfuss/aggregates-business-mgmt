package br.ufsc.aggregare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.model.dto.AuthenticationDTO;
import br.ufsc.aggregare.model.dto.LoginResponseDTO;
import br.ufsc.aggregare.security.TokenService;

@RestController
@RequestMapping(value = "/login")
public class AuthenticationController {

	private final AuthenticationManager authenticationManager;
	private final TokenService tokenService;

	@Autowired
	public AuthenticationController(AuthenticationManager authenticationManager, TokenService tokenService) {
		this.authenticationManager = authenticationManager;
		this.tokenService = tokenService;
	}

	@PostMapping
	public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthenticationDTO authDTO) {
		var usernamePassword = new UsernamePasswordAuthenticationToken(authDTO.username(), authDTO.password());
		var auth = authenticationManager.authenticate(usernamePassword);
		var token = tokenService.generateToken((User) auth.getPrincipal());
		return ResponseEntity.ok(new LoginResponseDTO(token));
	}
}

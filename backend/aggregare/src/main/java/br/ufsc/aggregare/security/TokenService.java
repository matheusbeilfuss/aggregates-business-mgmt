package br.ufsc.aggregare.security;


import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.security.exception.TokenException;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import jakarta.annotation.PostConstruct;

@Service
public class TokenService {

	@Value("${api.security.jwt.secret}")
	private String secret;

	@Value("${api.security.jwt.expiration}")
	private Duration expiration;

	@PostConstruct
	public void validate() {
		if (secret == null || secret.isBlank() || "secret".equals(secret) || secret.length() < 32) {
			throw new IllegalStateException("A chave secreta para JWT é inválida. Por favor, configure uma chave forte e segura.");
		}
	}

	public String generateToken(User user) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.create()
					.withIssuer("aggregare-api")
					.withSubject(user.getUsername())
					.withExpiresAt(getExpirationDate())
					.sign(algorithm);
		} catch (JWTCreationException e) {
			throw new TokenException("Erro ao gerar token JWT", e);
		}
	}

	public String validateToken(String token) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.require(algorithm)
					.withIssuer("aggregare-api")
					.build()
					.verify(token)
					.getSubject();
		} catch (JWTVerificationException e) {
			throw new TokenException("Token inválido ou expirado");
		}
	}

	private Instant getExpirationDate() {
		return Instant.now().plus(expiration);
	}
}

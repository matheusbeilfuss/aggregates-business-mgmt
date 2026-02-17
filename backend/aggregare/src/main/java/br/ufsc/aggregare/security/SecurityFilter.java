package br.ufsc.aggregare.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import br.ufsc.aggregare.repository.UserRepository;
import br.ufsc.aggregare.security.exception.TokenException;

import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter {

	private static final Logger LOGGER = LoggerFactory.getLogger(SecurityFilter.class);

	private final TokenService tokenService;
	private final UserRepository userRepository;

	@Autowired
	public SecurityFilter(TokenService tokenService, UserRepository userRepository) {
		this.tokenService = tokenService;
		this.userRepository = userRepository;
	}

	@Override protected void doFilterInternal(@Nonnull HttpServletRequest request, @Nonnull HttpServletResponse response, @Nonnull FilterChain filterChain) throws ServletException, IOException {
		var token = this.recoverToken(request);

		if (token != null) {
			try {
				var login = tokenService.validateToken(token);

				if (login != null && !login.isEmpty()) {
					UserDetails user = userRepository.findByUsername(login);
					if (user != null) {
						var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
						SecurityContextHolder.getContext().setAuthentication(authentication);
					}
				}
			} catch (TokenException e) {
				LOGGER.warn("Falha na validação do token: {}", e.getMessage());

				SecurityContextHolder.clearContext();

				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().write(e.getMessage());

				return;
			}
		}

		filterChain.doFilter(request, response);
	}

	private String recoverToken(HttpServletRequest request) {
		var authHeader = request.getHeader("Authorization");
		if (authHeader == null) return null;
		return authHeader.replace("Bearer ", "");
	}
}

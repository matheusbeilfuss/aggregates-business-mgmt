package br.ufsc.aggregare.security;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import br.ufsc.aggregare.controller.exception.StandardError;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

	private final SecurityFilter securityFilter;

	@Value("${api.cors.allowed-origins}")
	private String allowedOrigins;

	@Autowired
	public SecurityConfig(SecurityFilter securityFilter) {
		this.securityFilter = securityFilter;
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint(ObjectMapper objectMapper) {
		return (request, response, authException) -> {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");

			var errorResponse = new StandardError(Instant.now(), HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized", authException.getMessage(), request.getRequestURI());

			response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
		};
	}

	@Bean
	public AccessDeniedHandler accessDeniedHandler(ObjectMapper objectMapper) {
		return (request, response, accessDeniedException) -> {
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");

			var errorResponse = new StandardError(Instant.now(), HttpServletResponse.SC_FORBIDDEN, "Forbidden", accessDeniedException.getMessage(), request.getRequestURI());

			response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
		};
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, AuthenticationEntryPoint authenticationEntryPoint, AccessDeniedHandler accessDeniedHandler) throws Exception {
		String adminRole = "ADMIN";
		String usersRoutes = "/users/**";

		return httpSecurity
				.cors(Customizer.withDefaults())
				.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(exception -> exception
						.authenticationEntryPoint(authenticationEntryPoint)
						.accessDeniedHandler(accessDeniedHandler)
				)
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers("/login").permitAll()
						.requestMatchers("/h2-console/**").permitAll()
						.requestMatchers("/favicon.ico").permitAll()
						.requestMatchers(HttpMethod.GET, "/users/me").authenticated()
						.requestMatchers(HttpMethod.GET, "/users/me/avatar").authenticated()
						.requestMatchers(HttpMethod.GET, usersRoutes).hasRole(adminRole)
						.requestMatchers(HttpMethod.POST, usersRoutes).hasRole(adminRole)
						.requestMatchers(HttpMethod.PUT, usersRoutes).hasRole(adminRole)
						.requestMatchers(HttpMethod.PATCH, usersRoutes).hasRole(adminRole)
						.requestMatchers(HttpMethod.DELETE, usersRoutes).hasRole(adminRole)
						.anyRequest().authenticated()
				)
				.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {

		if (allowedOrigins == null || allowedOrigins.isBlank()) {
			throw new IllegalStateException(
					"api.cors.allowed-origins não configurado"
			);
		}

		if (allowedOrigins.contains("*")) {
			throw new IllegalStateException(
					"Wildcard '*' não é permitido em api.cors.allowed-origins"
			);
		}

		CorsConfiguration configuration = new CorsConfiguration();

		List<String> origins = List.of(allowedOrigins.split(","));
		configuration.setAllowedOrigins(origins);

		configuration.setAllowedMethods(
				List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
		);

		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source =
				new UrlBasedCorsConfigurationSource();

		source.registerCorsConfiguration("/**", configuration);

		return source;
	}
}

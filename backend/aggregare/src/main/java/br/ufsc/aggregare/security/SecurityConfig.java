package br.ufsc.aggregare.security;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

	private final SecurityFilter securityFilter;

	@Autowired
	public SecurityConfig(SecurityFilter securityFilter) {
		this.securityFilter = securityFilter;
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		String adminRole = "ADMIN";
		String usersRoutes = "/users/**";

		return httpSecurity
				.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers("/login").permitAll()
						.requestMatchers("/h2-console/**").permitAll()
						.requestMatchers("/favicon.ico").permitAll()
						.requestMatchers(HttpMethod.POST, usersRoutes).hasRole(adminRole)
						.requestMatchers(HttpMethod.GET, usersRoutes).hasRole(adminRole)
						.requestMatchers(HttpMethod.DELETE, usersRoutes).hasRole(adminRole)
						.anyRequest().authenticated()
				)
				.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.httpBasic(Customizer.withDefaults())
				.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
}

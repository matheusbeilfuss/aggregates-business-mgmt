package br.ufsc.aggregare.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.repository.UserRepository;

@Configuration
public class DataInitializer implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override public void run(String... args) throws Exception {
		String adminUsername = "admin";

		if (userRepository.findByUsername(adminUsername) == null) {
			User admin = new User();
			admin.setFirstName("Admin");
			admin.setLastName("User");
			admin.setUsername(adminUsername);
			admin.setEmail("");
			admin.setAdmin(true);
			admin.setPassword(passwordEncoder.encode("admin"));

			userRepository.save(admin);
		}
	}
}

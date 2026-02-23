package br.ufsc.aggregare.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.ufsc.aggregare.model.Settings;
import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.repository.SettingsRepository;
import br.ufsc.aggregare.repository.UserRepository;

@Configuration
@Profile("test")
public class DataInitializer implements CommandLineRunner {

	private static final Logger LOGGER = LoggerFactory.getLogger(DataInitializer.class);

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final SettingsRepository settingsRepository;

	@Value("${admin.initial-username:#{null}}")
	private String adminUsername;

	@Value("${admin.initial-password:#{null}}")
	private String adminPassword;

	public DataInitializer(UserRepository userRepository, SettingsRepository settingsRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.settingsRepository = settingsRepository;
	}

	@Override public void run(String... args) throws Exception {
		if (adminUsername != null && adminPassword != null && !userRepository.existsByUsername(adminUsername)) {
				User admin = new User();
				admin.setFirstName("Admin");
				admin.setLastName("User");
				admin.setUsername(adminUsername);
				admin.setEmail("admin@localhost.com");
				admin.setAdmin(true);
				admin.setPassword(passwordEncoder.encode(adminPassword));

				userRepository.save(admin);
				LOGGER.info("Admin user created with username: {}", adminUsername);
		}
		if (!settingsRepository.existsById(1L)) {
			settingsRepository.save(new Settings("Nome do Comércio"));
			LOGGER.info("Default settings created.");
		}
	}
}

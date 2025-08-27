package br.ufsc.aggregare.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.repository.UserRepository;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	@Override
	public void run(String... args) throws Exception {

		User user1 = new User(null, "João", "Silva", "joaosilva", "joaosilva@gmail.com", "1234567", "localhost:8080/images/1", true);

		userRepository.saveAll(Arrays.asList(user1));
	}
}

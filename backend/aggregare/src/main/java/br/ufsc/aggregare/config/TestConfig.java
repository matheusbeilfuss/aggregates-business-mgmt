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

	private final UserRepository userRepository;

	@Autowired
	public TestConfig(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public void run(String... args) throws Exception {

		User user1 = new User(null, "João", "Silva", "joaosilva", "joao@gmail.com", "1234567", "localhost:8080/images/1", true);
		User user2 = new User(null, "Maria", "Oliveira", "mariaoliveira", "maria@gmail.com", "2345678", "localhost:8080/images/2", false);
		User user3 = new User(null, "José", "Santos", "josesantos", "jose@gmail.com", "3456789", "localhost:8080/images/3", false);

		userRepository.saveAll(Arrays.asList(user1, user2, user3));
	}
}

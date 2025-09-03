package br.ufsc.aggregare.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import br.ufsc.aggregare.model.Supplier;
import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.repository.SupplierRepository;
import br.ufsc.aggregare.repository.UserRepository;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

	private final UserRepository userRepository;
	private final SupplierRepository supplierRepository;

	@Autowired
	public TestConfig(UserRepository userRepository, SupplierRepository supplierRepository) {
		this.userRepository = userRepository;
		this.supplierRepository = supplierRepository;
	}

	@Override
	public void run(String... args) throws Exception {

		User user1 = new User(null, "João", "Silva", "joaosilva", "joao@gmail.com", "1234567", "localhost:8080/images/1", true);
		User user2 = new User(null, "Maria", "Oliveira", "mariaoliveira", "maria@gmail.com", "2345678", "localhost:8080/images/2", false);
		User user3 = new User(null, "José", "Santos", "josesantos", "jose@gmail.com", "3456789", "localhost:8080/images/3", false);

		userRepository.saveAll(Arrays.asList(user1, user2, user3));

		Supplier supplier1 = new Supplier(null, "Brita N° 0", "Carlos Mineração", 70.00, 350.00, 53.00, 1.45);
		Supplier supplier2 = new Supplier(null, "Brita N° 1", "Areias Rio Claro", 73.00, 365.00, 55.00, 1.5);
		Supplier supplier3 = new Supplier(null, "Brita N° 2", "Areias EH", 73.00, 365.00, 55.00, 1.5);

		supplierRepository.saveAll(Arrays.asList(supplier1, supplier2, supplier3));
	}
}

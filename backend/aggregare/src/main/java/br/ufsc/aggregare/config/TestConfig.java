package br.ufsc.aggregare.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import br.ufsc.aggregare.model.Address;
import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.model.Client;
import br.ufsc.aggregare.model.Phone;
import br.ufsc.aggregare.model.Price;
import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.ProductSupplier;
import br.ufsc.aggregare.model.Stock;
import br.ufsc.aggregare.model.Supplier;
import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.model.enums.PhoneTypeEnum;
import br.ufsc.aggregare.repository.AddressRepository;
import br.ufsc.aggregare.repository.CategoryRepository;
import br.ufsc.aggregare.repository.ClientRepository;
import br.ufsc.aggregare.repository.PhoneRepository;
import br.ufsc.aggregare.repository.PriceRepository;
import br.ufsc.aggregare.repository.ProductRepository;
import br.ufsc.aggregare.repository.ProductSupplierRepository;
import br.ufsc.aggregare.repository.StockRepository;
import br.ufsc.aggregare.repository.SupplierRepository;
import br.ufsc.aggregare.repository.UserRepository;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

	private final UserRepository userRepository;
	private final CategoryRepository categoryRepository;
	private final ProductRepository productRepository;
	private final SupplierRepository supplierRepository;
	private final ProductSupplierRepository productSupplierRepository;
	private final StockRepository stockRepository;
	private final PriceRepository priceRepository;
	private final ClientRepository clientRepository;
	private final PhoneRepository phoneRepository;
	private final AddressRepository addressRepository;

	@Autowired
	public TestConfig(
			UserRepository userRepository,
			CategoryRepository categoryRepository,
			ProductRepository productRepository,
			SupplierRepository supplierRepository,
			ProductSupplierRepository productSupplierRepository,
			StockRepository stockRepository,
			PriceRepository priceRepository,
			ClientRepository clientRepository,
			PhoneRepository phoneRepository,
			AddressRepository addressRepository) {
		this.userRepository = userRepository;
		this.categoryRepository = categoryRepository;
		this.productRepository = productRepository;
		this.supplierRepository = supplierRepository;
		this.productSupplierRepository = productSupplierRepository;
		this.stockRepository = stockRepository;
		this.priceRepository = priceRepository;
		this.clientRepository = clientRepository;
		this.phoneRepository = phoneRepository;
		this.addressRepository = addressRepository;
	}

	@Override
	public void run(String... args) throws Exception {

		User user1 = new User(null, "João", "Silva", "joaosilva", "joao@gmail.com", "1234567", "localhost:8080/images/1", true);
		User user2 = new User(null, "Maria", "Oliveira", "mariaoliveira", "maria@gmail.com", "2345678", "localhost:8080/images/2", false);
		User user3 = new User(null, "José", "Santos", "josesantos", "jose@gmail.com", "3456789", "localhost:8080/images/3", false);
		userRepository.saveAll(Arrays.asList(user1, user2, user3));

		Category cat1 = new Category(null, "Britas Escuras");
		Category cat2 = new Category(null, "Britas Claras");
		categoryRepository.saveAll(Arrays.asList(cat1, cat2));

		Product p1 = new Product(null, "Brita N° 0", cat1);
		Product p2 = new Product(null, "Brita N° 1", cat1);
		Product p3 = new Product(null, "Brita N° 2", cat2);
		productRepository.saveAll(Arrays.asList(p1, p2, p3));

		Supplier s1 = new Supplier(null, "Carlos Mineração");
		Supplier s2 = new Supplier(null, "Areias Rio Claro");
		supplierRepository.saveAll(Arrays.asList(s1, s2));

		ProductSupplier ps1 = new ProductSupplier(null, p1, s1, 53.00, 70.00, 350.00, 1.45);
		ProductSupplier ps2 = new ProductSupplier(null, p2, s2, 55.00, 73.00, 365.00, 1.5);
		ProductSupplier ps3 = new ProductSupplier(null, p2, s1, 54.00, 71.00, 355.00, 1.48);
		productSupplierRepository.saveAll(Arrays.asList(ps1, ps2, ps3));

		Stock stock1 = new Stock(null, 10000.0, 15.0, p1);
		stockRepository.save(stock1);

		Price price1 = new Price(null, 0, 83.00, cat1);
		Price price2 = new Price(null, 1, 140.00, cat1);
		priceRepository.saveAll(Arrays.asList(price1, price2));

		Client client1 = new Client(null, "Ana Paula", "12345678900", "ana@gmail.com");
		Client client2 = new Client(null, "Bruno Costa", "98765432100", "bruno@gmail.com");
		clientRepository.saveAll(Arrays.asList(client1, client2));

		Phone phone1 = new Phone(null, client1, "(48) 91234-5678", PhoneTypeEnum.WHATSAPP);
		Phone phone2 = new Phone(null, client1, "(48) 3456-7890", PhoneTypeEnum.FIXO);
		Phone phone3 = new Phone(null, client2, "(48) 99876-5432", PhoneTypeEnum.OUTRO);
		phoneRepository.saveAll(Arrays.asList(phone1, phone2, phone3));

		Address address1 = new Address(null, client1, "SC", "Florianópolis", "Centro", "Rua das Flores", "100");
		Address address2 = new Address(null, client2, "SC", "Florianópolis", "Pantanal", "Rua dos Papagaios", "1500");
		addressRepository.saveAll(Arrays.asList(address1, address2));
	}
}

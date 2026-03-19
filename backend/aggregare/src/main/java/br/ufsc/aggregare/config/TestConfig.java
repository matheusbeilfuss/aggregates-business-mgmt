package br.ufsc.aggregare.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import br.ufsc.aggregare.model.Address;
import br.ufsc.aggregare.model.Category;
import br.ufsc.aggregare.model.Client;
import br.ufsc.aggregare.model.Expense;
import br.ufsc.aggregare.model.FixedExpense;
import br.ufsc.aggregare.model.Fuel;
import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.OrderAddress;
import br.ufsc.aggregare.model.Payment;
import br.ufsc.aggregare.model.Phone;
import br.ufsc.aggregare.model.Price;
import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.ProductSupplier;
import br.ufsc.aggregare.model.Stock;
import br.ufsc.aggregare.model.Supplier;
import br.ufsc.aggregare.model.User;
import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.model.enums.OrderStatusEnum;
import br.ufsc.aggregare.model.enums.OrderTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentMethodEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;
import br.ufsc.aggregare.model.enums.PhoneTypeEnum;
import br.ufsc.aggregare.repository.AddressRepository;
import br.ufsc.aggregare.repository.CategoryRepository;
import br.ufsc.aggregare.repository.ClientRepository;
import br.ufsc.aggregare.repository.ExpenseRepository;
import br.ufsc.aggregare.repository.FixedExpenseRepository;
import br.ufsc.aggregare.repository.FuelRepository;
import br.ufsc.aggregare.repository.OrderAddressRepository;
import br.ufsc.aggregare.repository.OrderRepository;
import br.ufsc.aggregare.repository.PaymentRepository;
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
	private final OrderRepository orderRepository;
	private final OrderAddressRepository orderAddressRepository;
	private final PaymentRepository paymentRepository;
	private final ExpenseRepository expenseRepository;
	private final FixedExpenseRepository fixedExpenseRepository;
	private final FuelRepository fuelRepository;

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
			AddressRepository addressRepository,
			OrderRepository orderRepository,
			OrderAddressRepository orderAddressRepository,
			PaymentRepository paymentRepository,
			ExpenseRepository expenseRepository,
			FixedExpenseRepository fixedExpenseRepository,
			FuelRepository fuelRepository) {
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
		this.orderRepository = orderRepository;
		this.orderAddressRepository = orderAddressRepository;
		this.paymentRepository = paymentRepository;
		this.expenseRepository = expenseRepository;
		this.fixedExpenseRepository = fixedExpenseRepository;
		this.fuelRepository = fuelRepository;
	}

	@Override
	public void run(String... args) throws Exception {

		User user1 = new User(null, "João", "Silva", "joaosilva", "joao@gmail.com", "1234567", null, true);
		User user2 = new User(null, "Maria", "Oliveira", "mariaoliveira", "maria@gmail.com", "2345678", null, false);
		User user3 = new User(null, "José", "Santos", "josesantos", "jose@gmail.com", "3456789", null, false);
		userRepository.saveAll(Arrays.asList(user1, user2, user3));

		Category category1 = new Category(null, "Britas Escuras");
		Category category2 = new Category(null, "Britas Claras");
		categoryRepository.saveAll(Arrays.asList(category1, category2));

		Product product1 = new Product(null, "Brita N° 0", category1);
		Product product2 = new Product(null, "Brita N° 1", category1);
		Product product3 = new Product(null, "Brita N° 2", category2);
		productRepository.saveAll(Arrays.asList(product1, product2, product3));

		Supplier supplier1 = new Supplier(null, "Carlos Mineração");
		Supplier supplier2 = new Supplier(null, "Areias Rio Claro");
		supplierRepository.saveAll(Arrays.asList(supplier1, supplier2));

		ProductSupplier productSupplier1 = new ProductSupplier(null, product1, supplier1, 53.00, 70.00, 350.00, 1.45, null);
		ProductSupplier productSupplier2 = new ProductSupplier(null, product2, supplier2, 55.00, 73.00, 365.00, 1.50, "Pegar lá");
		ProductSupplier productSupplier3 = new ProductSupplier(null, product2, supplier1, 54.00, 71.00, 355.00, 1.48, "Depósito");
		productSupplierRepository.saveAll(Arrays.asList(productSupplier1, productSupplier2, productSupplier3));

		Stock stock1 = new Stock(null, 43.5, 30.0, 1.45, product1);
		Stock stock2 = new Stock(null, 30.0, 20.0, 1.50, product2);
		Stock stock3 = new Stock(null, 72.5, 50.0, 1.45, product3);
		stockRepository.saveAll(Arrays.asList(stock1, stock2, stock3));

		Price price1  = new Price(null, 0, 83.00,  category1);
		Price price2  = new Price(null, 1, 140.00, category1);
		Price price3  = new Price(null, 2, 155.00, category1);
		Price price4  = new Price(null, 3, 250.00, category1);
		Price price5  = new Price(null, 4, 275.00, category1);
		Price price6  = new Price(null, 5, 300.00, category1);

		Price price7  = new Price(null, 0, 80.00,  category2);
		Price price8  = new Price(null, 1, 135.00, category2);
		Price price9  = new Price(null, 2, 150.00, category2);
		Price price10 = new Price(null, 3, 240.00, category2);
		Price price11 = new Price(null, 4, 265.00, category2);
		Price price12 = new Price(null, 5, 290.00, category2);

		priceRepository.saveAll(Arrays.asList(
				price1, price2, price3, price4, price5, price6,
				price7, price8, price9, price10, price11, price12));

		Client client1 = new Client(null, "Ana Paula", "12345678900", "ana@gmail.com");
		Client client2 = new Client(null, "Bruno Costa", "98765432100", "bruno@gmail.com");
		Client client3 = new Client(null, "Carla Silva", "45678912300", "carla@gmail.com");
		Client client4 = new Client(null, "Daniel Martins", "11122233344", "daniel@gmail.com");
		Client client5 = new Client(null, "Eduarda Lopes", "22233344455", "eduarda@gmail.com");
		Client client6 = new Client(null, "Felipe Rocha", "33344455566", "felipe@gmail.com");
		Client client7 = new Client(null, "Gabriela Souza", "44455566677", "gabriela@gmail.com");
		Client client8 = new Client(null, "Henrique Alves", "55566677788", "henrique@gmail.com");
		Client client9 = new Client(null, "Isabela Fernandes", "66677788899", "isabela@gmail.com");
		Client client10 = new Client(null, "João Pedro", "77788899900", "joao@gmail.com");

		clientRepository.saveAll(Arrays.asList(client1, client2, client3, client4, client5, client6, client7, client8, client9, client10));

		Phone phone1 = new Phone(null, client1, "(48) 91234-5678", PhoneTypeEnum.WHATSAPP);
		Phone phone2 = new Phone(null, client1, "(48) 3456-7890", PhoneTypeEnum.FIXO);
		Phone phone3 = new Phone(null, client2, "(48) 99876-5432", PhoneTypeEnum.OUTRO);
		Phone phone4 = new Phone(null, client3, "(48) 3456-3456",  PhoneTypeEnum.FIXO);
		Phone phone5 = new Phone(null, client4, "(48) 99111-1111", PhoneTypeEnum.WHATSAPP);
		Phone phone6 = new Phone(null, client4, "(48) 3333-1111", PhoneTypeEnum.FIXO);
		Phone phone7 = new Phone(null, client5, "(48) 99222-2222", PhoneTypeEnum.WHATSAPP);
		Phone phone8 = new Phone(null, client6, "(48) 99333-3333", PhoneTypeEnum.OUTRO);
		Phone phone9 = new Phone(null, client6, "(48) 3344-3333", PhoneTypeEnum.FIXO);
		Phone phone10 = new Phone(null, client7, "(48) 99444-4444", PhoneTypeEnum.WHATSAPP);
		Phone phone11 = new Phone(null, client7, "(48) 99555-4444", PhoneTypeEnum.OUTRO);
		Phone phone12 = new Phone(null, client8, "(48) 99666-6666", PhoneTypeEnum.WHATSAPP);
		Phone phone13 = new Phone(null, client9, "(48) 99777-7777", PhoneTypeEnum.WHATSAPP);
		Phone phone14 = new Phone(null, client9, "(48) 3377-7777", PhoneTypeEnum.FIXO);
		Phone phone15 = new Phone(null, client10, "(48) 99888-8888", PhoneTypeEnum.WHATSAPP);
		Phone phone16 = new Phone(null, client10, "(48) 3388-8888", PhoneTypeEnum.FIXO);
		Phone phone17 = new Phone(null, client10, "(48) 99999-9999", PhoneTypeEnum.OUTRO);

		phoneRepository.saveAll(Arrays.asList(phone1, phone2, phone3, phone4, phone5, phone6, phone7, phone8, phone9, phone10, phone11, phone12, phone13, phone14, phone15, phone16, phone17));

		Address address1 = new Address(null, client1, "Rua das Flores", "100", "Apto. 110", "Centro", "Florianópolis", "SC", "88000-000");
		Address address2 = new Address(null, client2, "Rua dos Papagaios", "1500", "Casa Esquina", "Pantanal", "Florianópolis", "SC", "88040-000");
		Address address3 = new Address(null, client3, "Rua Cap. Romualdo de Barros", "2100", "Ao lado da padaria", "Carvoeira", "Florianópolis", "SC", "88040-600");
		Address address4 = new Address(null, client4, "Rua Lauro Linhares", "1200", "Casa Amarela", "Trindade", "Florianópolis", "SC", "88036-002");
		Address address5 = new Address(null, client5, "Rua Pastor William", "350", "Prédio verde", "Itacorubi", "Florianópolis", "SC", "88034-101");
		Address address6 = new Address(null, client6, "Rua Desembargador Pedro Silva", "890", null, "Coqueiros", "Florianópolis", "SC", "88080-700");
		Address address7 = new Address(null, client7, "Rua General Liberato Bittencourt", "540", null, "Estreito", "Florianópolis", "SC", "88075-400");
		Address address8 = new Address(null, client8, "Rua Santos Saraiva", "760", null, "Capoeiras", "Florianópolis", "SC", "88070-100");
		Address address9 = new Address(null, client9, "Servidão Caminho do Mar", "210", null, "Ingleses", "Florianópolis", "SC", "88058-620");
		Address address10 = new Address(null, client10, "Rua Pequeno Príncipe", "980", null, "Campeche", "Florianópolis", "SC", "88063-000");

		addressRepository.saveAll(Arrays.asList(address1, address2, address3, address4, address5, address6, address7, address8, address9, address10));

		LocalDate dataTeste1 = LocalDate.now();
		LocalTime horaTeste1 = LocalTime.now();

		OrderAddress orderAddress1 = new OrderAddress(null, "Rua A", "200", "Apto. 104", "Bairro A", "Cidade A", "SC", "88040-000");
		OrderAddress orderAddress2 = new OrderAddress(null, "Avenida X", "300", "Casa Esquina", "Bairro B", "Cidade B", "SC", "88040-000");
		OrderAddress orderAddress3 = new OrderAddress(null, "Rua B", "400", "Apto. 12", "Bairro C", "Cidade C", "SC", "88040-000");
		OrderAddress orderAddress4 = new OrderAddress(null, "Avenida Y", "500", "Casa Azul", "Bairro D", "Cidade D", "SC", "88040-000");
		orderAddressRepository.saveAll(Arrays.asList(orderAddress1, orderAddress2, orderAddress3, orderAddress4));

		Order order1 = new Order(null, product1, client1, orderAddress1, 5.0, 7.5, null, OrderTypeEnum.MATERIAL, dataTeste1, horaTeste1, "Entregar no portão", OrderStatusEnum.PENDING, PaymentStatusEnum.PARTIAL, BigDecimal.valueOf(415.00), BigDecimal.valueOf(215.00));
		Order order2 = new Order(null, product2, client2, orderAddress2, null, null, "Serviço de máquina", OrderTypeEnum.SERVICE, dataTeste1, horaTeste1, "Ligar antes de chegar", OrderStatusEnum.PENDING, PaymentStatusEnum.PARTIAL, BigDecimal.valueOf(500.00), BigDecimal.valueOf(200.00));
		Order order3 = new Order(null, product3, client1, orderAddress3, 10.0, 15.0, null, OrderTypeEnum.MATERIAL, dataTeste1.minusMonths(2), horaTeste1, "Casa amarela", OrderStatusEnum.DELIVERED, PaymentStatusEnum.PARTIAL, BigDecimal.valueOf(1450.00), BigDecimal.valueOf(450.00));
		Order order4 = new Order(null, product1, client3, orderAddress4, 3.0, 4.5, null, OrderTypeEnum.MATERIAL, dataTeste1.minusMonths(2), horaTeste1, "Obra no fim da rua", OrderStatusEnum.PENDING, PaymentStatusEnum.PENDING, BigDecimal.valueOf(250.00), BigDecimal.valueOf(250.00));
		orderRepository.saveAll(Arrays.asList(order1, order2, order3, order4));

		Payment payment1 = new Payment(null, order1, BigDecimal.valueOf(200.00), dataTeste1, PaymentMethodEnum.CASH);
		Payment payment2 = new Payment(null, order2, BigDecimal.valueOf(300.00), dataTeste1, PaymentMethodEnum.BANK_TRANSFER);
		paymentRepository.saveAll(Arrays.asList(payment1, payment2));

		FixedExpense fixedExpense1 = new FixedExpense(null, "Mensalidade Sindicato", BigDecimal.valueOf(80.00), "Sindicato");
		FixedExpense fixedExpense2 = new FixedExpense(null, "Jornal", BigDecimal.valueOf(20.00), "Escritório");
		fixedExpenseRepository.saveAll(Arrays.asList(fixedExpense1, fixedExpense2));

		LocalDate dataTeste2 = LocalDate.now().plusMonths(1);

		Expense expense1 = new Expense(null, "Conserto pneu caminhão", BigDecimal.valueOf(150.00), dataTeste1, dataTeste2, dataTeste1, ExpenseTypeEnum.VARIABLE, PaymentStatusEnum.PAID, "Mecânica");
		Expense expense2 = new Expense(null, fixedExpense1.getName(), fixedExpense1.getDefaultValue(), dataTeste1, dataTeste2, null, ExpenseTypeEnum.FIXED, PaymentStatusEnum.PENDING, fixedExpense1.getCategory());
		Expense expense3 = new Expense(null, fixedExpense2.getName(), fixedExpense2.getDefaultValue(), dataTeste1, dataTeste2, null, ExpenseTypeEnum.FIXED, PaymentStatusEnum.PENDING, fixedExpense2.getCategory());
		Expense expense4 = new Expense(null, "Combustível máquina", BigDecimal.valueOf(250.00), dataTeste1, dataTeste2, dataTeste1, ExpenseTypeEnum.FUEL, PaymentStatusEnum.PAID, "Combustível");
		expenseRepository.saveAll(Arrays.asList(expense1, expense2, expense3, expense4));

		Fuel fuel1 = new Fuel(null, expense4, "Mercedes 1313", 100.00, 85.30, 6.03, "Posto Dom Bosco");
		fuelRepository.save(fuel1);
	}
}

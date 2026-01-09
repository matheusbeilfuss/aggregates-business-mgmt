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

		User user1 = new User(null, "João", "Silva", "joaosilva", "joao@gmail.com", "1234567", "localhost:8080/images/1", true);
		User user2 = new User(null, "Maria", "Oliveira", "mariaoliveira", "maria@gmail.com", "2345678", "localhost:8080/images/2", false);
		User user3 = new User(null, "José", "Santos", "josesantos", "jose@gmail.com", "3456789", "localhost:8080/images/3", false);
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

		ProductSupplier productSupplier1 = new ProductSupplier(null, product1, supplier1, 53.00, 70.00, 350.00, 1.45);
		ProductSupplier productSupplier2 = new ProductSupplier(null, product2, supplier2, 55.00, 73.00, 365.00, 1.5);
		ProductSupplier productSupplier3 = new ProductSupplier(null, product2, supplier1, 54.00, 71.00, 355.00, 1.48);
		productSupplierRepository.saveAll(Arrays.asList(productSupplier1, productSupplier2, productSupplier3));

		Stock stock1 = new Stock(null, 10000.0, 15.0, product1);
		stockRepository.save(stock1);

		Price price1 = new Price(null, 0, 83.00, category1);
		Price price2 = new Price(null, 1, 140.00, category1);
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

		LocalDate dataTeste1 = LocalDate.of(2025, 11, 11);
		LocalTime horaTeste1 = LocalTime.of(10, 30, 0);

		OrderAddress orderAddress1 = new OrderAddress(null, "Rua A", "200", "Bairro B", "Cidade C", "SC");
		OrderAddress orderAddress2 = new OrderAddress(null, "Avenida X", "500", "Bairro Y", "Cidade Z", "SC");
		orderAddressRepository.saveAll(Arrays.asList(orderAddress1, orderAddress2));

		Order order1 = new Order(null, product1, client1, orderAddress1, 5.0, null, OrderTypeEnum.MATERIAL, dataTeste1, horaTeste1, "Entregar no portão", OrderStatusEnum.PENDING, PaymentStatusEnum.PENDING, BigDecimal.valueOf(415.00));
		Order order2 = new Order(null, product2, client2, orderAddress2, null, "Serviço de máquina", OrderTypeEnum.SERVICE, dataTeste1, horaTeste1, "Ligar antes de chegar", OrderStatusEnum.PENDING, PaymentStatusEnum.PENDING, BigDecimal.valueOf(500.00));
		orderRepository.saveAll(Arrays.asList(order1, order2));

		Payment payment1 = new Payment(null, order1, BigDecimal.valueOf(200.00), dataTeste1, PaymentMethodEnum.CASH);
		Payment payment2 = new Payment(null, order2, BigDecimal.valueOf(300.00), dataTeste1, PaymentMethodEnum.BANK_TRANSFER);
		paymentRepository.saveAll(Arrays.asList(payment1, payment2));

		FixedExpense fixedExpense1 = new FixedExpense(null, "Mensalidade Sindicato", BigDecimal.valueOf(80.00), "Sindicato");
		FixedExpense fixedExpense2 = new FixedExpense(null, "Jornal", BigDecimal.valueOf(20.00), "Escritório");
		fixedExpenseRepository.saveAll(Arrays.asList(fixedExpense1, fixedExpense2));

		LocalDate expenseDate1 = LocalDate.of(2025, 12, 19);
		LocalDate expenseDueDate1 = LocalDate.of(2026, 1, 19);

		LocalDate expenseDate2 = LocalDate.of(2025, 11, 28);
		LocalDate expenseDueDate2 = LocalDate.of(2025, 12, 28);

		Expense expense1 = new Expense(null, "Conserto pneu caminhão", BigDecimal.valueOf(150.00), expenseDate1, expenseDueDate1, expenseDate1, ExpenseTypeEnum.VARIABLE, PaymentStatusEnum.PAID, "Mecânica");
		Expense expense2 = new Expense(null, fixedExpense1.getName(), fixedExpense1.getDefaultValue(), expenseDate1, expenseDueDate1, null, ExpenseTypeEnum.FIXED, PaymentStatusEnum.PENDING, fixedExpense1.getCategory());
		Expense expense3 = new Expense(null, fixedExpense2.getName(), fixedExpense2.getDefaultValue(), expenseDate2, expenseDueDate2, null, ExpenseTypeEnum.FIXED, PaymentStatusEnum.PENDING, fixedExpense2.getCategory());
		Expense expense4 = new Expense(null, "Combustível máquina", BigDecimal.valueOf(250.00), expenseDate2, expenseDueDate2, expenseDate2, ExpenseTypeEnum.FUEL, PaymentStatusEnum.PAID, "Combustível");
		expenseRepository.saveAll(Arrays.asList(expense1, expense2, expense3, expense4));

		Fuel fuel1 = new Fuel(null, expense4, "Mercedes 1313", 100, 85.30, 6.03, "Posto Dom Bosco");
		fuelRepository.save(fuel1);
	}
}

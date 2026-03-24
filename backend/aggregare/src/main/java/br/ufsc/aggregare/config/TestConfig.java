package br.ufsc.aggregare.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

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

	// Constantes - bairros e cidade

	private static final String CIDADE          = "Florianópolis";
	private static final String CENTRO          = "Centro";
	private static final String TRINDADE        = "Trindade";
	private static final String ITACORUBI       = "Itacorubi";
	private static final String CARVOEIRA       = "Carvoeira";
	private static final String AGRONOMICA      = "Agronômica";
	private static final String CORREGO_GRANDE  = "Córrego Grande";
	private static final String PANTANAL        = "Pantanal";
	private static final String COQUEIROS       = "Coqueiros";
	private static final String ESTREITO        = "Estreito";
	private static final String CAMPECHE        = "Campeche";
	private static final String CAPOEIRAS       = "Capoeiras";
	private static final String INGLESES        = "Ingleses";

	// CEPs reutilizados
	private static final String CEP_CORREGO     = "88037-000";

	// Constantes - categorias de despesa

	private static final String CAT_MECANICA    = "Mecânica";
	private static final String CAT_ESCRITORIO  = "Escritório";
	private static final String CAT_MANUTENCAO  = "Manutenção";
	private static final String CAT_EQUIPAMENTOS = "Equipamentos";

	// Constantes - veículo e postos de combustível

	private static final String CAMINHAO           = "Mercedes 1313";
	private static final String POSTO_DOM_BOSCO    = "Posto Dom Bosco";
	private static final String AUTO_POSTO_CENTRAL = "Auto Posto Central";
	private static final double PRECO_LITRO        = 6.03;

	// Repositórios

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

	// Utilitário de datas

	// Cria uma data no ano corrente
	private LocalDate d(int mes, int dia) {
		return LocalDate.of(LocalDate.now().getYear(), mes, dia);
	}

	// Entrypoint

	@Override
	public void run(String... args) {
		seedUsers();

		List<Category> categories = seedCategories();
		List<Product>  products   = seedProducts(categories);
		List<Supplier> suppliers  = seedSuppliers();
		seedProductSuppliers(products, suppliers);
		seedStocks(products);
		seedPrices(categories);

		List<Client> clients = seedClients();
		seedPhonesAndAddresses(clients);

		seedOrdersAndPayments(products, clients);
		seedExpenses();
	}

	// Usuários

	private void seedUsers() {
		userRepository.saveAll(Arrays.asList(
				new User(null, "João",     "Silva",    "joaosilva",     "joao@gmail.com",     "1234567", null, true),
				new User(null, "Maria",    "Oliveira", "mariaoliveira", "maria@gmail.com",    "2345678", null, false),
				new User(null, "José",     "Santos",   "josesantos",    "jose@gmail.com",     "3456789", null, false),
				new User(null, "Fernanda", "Ramos",    "fernanda",      "fernanda@gmail.com", "4567890", null, false)
		));
	}

	// Catálogo: categorias, produtos, fornecedores, estoque e preços

	private List<Category> seedCategories() {
		return categoryRepository.saveAll(Arrays.asList(
				new Category(null, "Britas Escuras"),   // cats[0]
				new Category(null, "Britas Claras"),    // cats[1]
				new Category(null, "Areias")            // cats[2]
		));
	}

	private List<Product> seedProducts(List<Category> cats) {
		return productRepository.saveAll(Arrays.asList(
				new Product(null, "Brita N° 0",   cats.get(0)),   // p[0]
				new Product(null, "Brita N° 1",   cats.get(0)),   // p[1]
				new Product(null, "Brita N° 2",   cats.get(1)),   // p[2]
				new Product(null, "Pedrisco",     cats.get(1)),   // p[3]
				new Product(null, "Areia Média",  cats.get(2)),   // p[4]
				new Product(null, "Areia Grossa", cats.get(2))    // p[5]
		));
	}

	private List<Supplier> seedSuppliers() {
		return supplierRepository.saveAll(Arrays.asList(
				new Supplier(null, "Carlos Mineração"),
				new Supplier(null, "Areias Rio Claro"),
				new Supplier(null, "Pedreiras Sul")
		));
	}

	private void seedProductSuppliers(List<Product> p, List<Supplier> s) {
		productSupplierRepository.saveAll(Arrays.asList(
				new ProductSupplier(null, p.get(0), s.get(0), 53.00, 70.00, 350.00, 1.45, null),
				new ProductSupplier(null, p.get(1), s.get(0), 55.00, 73.00, 365.00, 1.50, "Depósito"),
				new ProductSupplier(null, p.get(1), s.get(1), 54.00, 71.00, 355.00, 1.48, "Pegar lá"),
				new ProductSupplier(null, p.get(2), s.get(2), 50.00, 66.00, 330.00, 1.42, null),
				new ProductSupplier(null, p.get(3), s.get(2), 45.00, 60.00, 300.00, 1.38, null),
				new ProductSupplier(null, p.get(4), s.get(1), 40.00, 52.00, 260.00, 1.30, null),
				new ProductSupplier(null, p.get(5), s.get(1), 42.00, 55.00, 275.00, 1.35, null)
		));
	}

	private void seedStocks(List<Product> p) {
		stockRepository.saveAll(Arrays.asList(
				new Stock(null, 43.5, 30.0, 1.45, p.get(0)),
				new Stock(null, 30.0, 20.0, 1.50, p.get(1)),
				new Stock(null, 72.5, 50.0, 1.42, p.get(2)),
				new Stock(null,  8.0,  5.5, 1.38, p.get(3)),  // estoque crítico — aparece no dashboard
				new Stock(null, 55.0, 40.0, 1.30, p.get(4)),
				new Stock(null, 11.0,  8.0, 1.35, p.get(5))   // estoque baixo
		));
	}

	private void seedPrices(List<Category> cats) {
		// índice 0 = depósito, 1 = 1m³, 2 = 2m³, 3 = 3m³, 4 = 4m³, 5 = 5m³
		double[] britaEscura = { 83, 140, 155, 250, 275, 300 };
		double[] britaClara  = { 80, 135, 150, 240, 265, 290 };
		double[] areia       = { 60, 100, 115, 185, 210, 230 };

		for (int i = 0; i < 6; i++) {
			priceRepository.save(new Price(null, i, britaEscura[i], cats.get(0)));
			priceRepository.save(new Price(null, i, britaClara[i],  cats.get(1)));
			priceRepository.save(new Price(null, i, areia[i],       cats.get(2)));
		}
	}

	// Clientes, telefones e endereços

	private List<Client> seedClients() {
		return clientRepository.saveAll(Arrays.asList(
				new Client(null, "Ana Paula",         "12345678900", "ana@gmail.com"),        // c[0]
				new Client(null, "Bruno Costa",       "98765432100", "bruno@gmail.com"),      // c[1]
				new Client(null, "Carla Silva",       "45678912300", "carla@gmail.com"),      // c[2]
				new Client(null, "Daniel Martins",    "11122233344", "daniel@gmail.com"),     // c[3]
				new Client(null, "Eduarda Lopes",     "22233344455", "eduarda@gmail.com"),    // c[4]
				new Client(null, "Felipe Rocha",      "33344455566", "felipe@gmail.com"),     // c[5]
				new Client(null, "Gabriela Souza",    "44455566677", "gabriela@gmail.com"),   // c[6]
				new Client(null, "Henrique Alves",    "55566677788", "henrique@gmail.com"),   // c[7]
				new Client(null, "Isabela Fernandes", "66677788899", "isabela@gmail.com"),    // c[8]
				new Client(null, "João Pedro",        "77788899900", "joaopedro@gmail.com"),  // c[9]
				new Client(null, "Karen Lima",        "88899900011", "karen@gmail.com"),      // c[10]
				new Client(null, "Lucas Pereira",     "99900011122", "lucas@gmail.com")       // c[11]
		));
	}

	private void seedPhonesAndAddresses(List<Client> c) {
		phoneRepository.saveAll(Arrays.asList(
				new Phone(null, c.get(0),  "(48) 91234-5678", PhoneTypeEnum.WHATSAPP),
				new Phone(null, c.get(0),  "(48) 3456-7890",  PhoneTypeEnum.FIXO),
				new Phone(null, c.get(1),  "(48) 99876-5432", PhoneTypeEnum.OUTRO),
				new Phone(null, c.get(2),  "(48) 3456-3456",  PhoneTypeEnum.FIXO),
				new Phone(null, c.get(3),  "(48) 99111-1111", PhoneTypeEnum.WHATSAPP),
				new Phone(null, c.get(3),  "(48) 3333-1111",  PhoneTypeEnum.FIXO),
				new Phone(null, c.get(4),  "(48) 99222-2222", PhoneTypeEnum.WHATSAPP),
				new Phone(null, c.get(5),  "(48) 99333-3333", PhoneTypeEnum.OUTRO),
				new Phone(null, c.get(5),  "(48) 3344-3333",  PhoneTypeEnum.FIXO),
				new Phone(null, c.get(6),  "(48) 99444-4444", PhoneTypeEnum.WHATSAPP),
				new Phone(null, c.get(6),  "(48) 99555-4444", PhoneTypeEnum.OUTRO),
				new Phone(null, c.get(7),  "(48) 99666-6666", PhoneTypeEnum.WHATSAPP),
				new Phone(null, c.get(8),  "(48) 99777-7777", PhoneTypeEnum.WHATSAPP),
				new Phone(null, c.get(8),  "(48) 3377-7777",  PhoneTypeEnum.FIXO),
				new Phone(null, c.get(9),  "(48) 99888-8888", PhoneTypeEnum.WHATSAPP),
				new Phone(null, c.get(9),  "(48) 3388-8888",  PhoneTypeEnum.FIXO),
				new Phone(null, c.get(9),  "(48) 99999-9999", PhoneTypeEnum.OUTRO),
				new Phone(null, c.get(10), "(48) 99100-1001", PhoneTypeEnum.WHATSAPP),
				new Phone(null, c.get(11), "(48) 99200-2002", PhoneTypeEnum.WHATSAPP)
		));

		addressRepository.saveAll(Arrays.asList(
				new Address(null, c.get(0),  "Rua das Flores",                "100",  "Apto. 110",       CENTRO,        CIDADE, "SC", "88000-000"),
				new Address(null, c.get(1),  "Rua dos Papagaios",             "1500", "Casa Esquina",    PANTANAL,      CIDADE, "SC", "88040-000"),
				new Address(null, c.get(2),  "Rua Cap. Romualdo de Barros",   "2100", "Ao lado padaria", CARVOEIRA,     CIDADE, "SC", "88040-600"),
				new Address(null, c.get(3),  "Rua Lauro Linhares",            "1200", "Casa Amarela",    TRINDADE,      CIDADE, "SC", "88036-002"),
				new Address(null, c.get(4),  "Rua Pastor William",            "350",  "Prédio Verde",    ITACORUBI,     CIDADE, "SC", "88034-101"),
				new Address(null, c.get(5),  "Rua Desembargador Pedro Silva", "890",  null,              COQUEIROS,     CIDADE, "SC", "88080-700"),
				new Address(null, c.get(6),  "Rua Gen. Liberato Bittencourt", "540",  null,              ESTREITO,      CIDADE, "SC", "88075-400"),
				new Address(null, c.get(7),  "Rua Santos Saraiva",            "760",  null,              CAPOEIRAS,     CIDADE, "SC", "88070-100"),
				new Address(null, c.get(8),  "Servidão Caminho do Mar",       "210",  null,              INGLESES,      CIDADE, "SC", "88058-620"),
				new Address(null, c.get(9),  "Rua Pequeno Príncipe",          "980",  null,              CAMPECHE,      CIDADE, "SC", "88063-000"),
				new Address(null, c.get(10), "Rua João Pio Duarte Silva",     "300",  null,              CORREGO_GRANDE,CIDADE, "SC", CEP_CORREGO),
				new Address(null, c.get(11), "Avenida Beira Mar Norte",       "450",  "Bloco B",         AGRONOMICA,    CIDADE, "SC", "88025-301")
		));
	}

	// Pedidos e pagamentos
	// Mês atual: 2 entregues (início) + 3 pendentes para hoje

	private void seedOrdersAndPayments(List<Product> p, List<Client> c) {

		LocalTime manha  = LocalTime.of(8,  30);
		LocalTime tarde1 = LocalTime.of(13,  0);
		LocalTime tarde2 = LocalTime.of(15, 30);

		OrderAddress[] oa = orderAddressRepository.saveAll(Arrays.asList(
				// Janeiro [0..5]
				new OrderAddress(null, "Rua das Acácias",               "110", null,         TRINDADE,       CIDADE, "SC", "88036-000"),
				new OrderAddress(null, "Rua Dep. Mário Pugliesi",       "205", "Casa Fundo", ITACORUBI,      CIDADE, "SC", "88034-000"),
				new OrderAddress(null, "Av. Madre Benvenuta",           "1237",null,         CORREGO_GRANDE, CIDADE, "SC", CEP_CORREGO),
				new OrderAddress(null, "Rua Dom Jaime de Barros Câmara","310", null,         PANTANAL,       CIDADE, "SC", "88040-000"),
				new OrderAddress(null, "Rua Cap. Romualdo de Barros",   "88",  null,         CARVOEIRA,      CIDADE, "SC", "88040-600"),
				new OrderAddress(null, "Rua Tenente Silveira",          "150", "Bloco A",    CENTRO,         CIDADE, "SC", "88010-000"),
				// Fevereiro [6..11]
				new OrderAddress(null, "Rua Bocaiúva",                  "2150",null,         CENTRO,         CIDADE, "SC", "88015-530"),
				new OrderAddress(null, "Rua Osmar Cunha",               "183", null,         CENTRO,         CIDADE, "SC", "88015-100"),
				new OrderAddress(null, "Rua Felipe Schmidt",            "515", "Apto 302",   CENTRO,         CIDADE, "SC", "88010-000"),
				new OrderAddress(null, "Servidão dos Açores",           "44",  null,         CAMPECHE,       CIDADE, "SC", "88063-000"),
				new OrderAddress(null, "Rua Ivo Silveira",              "920", null,         CAPOEIRAS,      CIDADE, "SC", "88070-000"),
				new OrderAddress(null, "Rua Henrique Veras",            "320", null,         "Lagoa da Conc.",CIDADE,"SC", "88062-000"),
				// Março [12..17]
				new OrderAddress(null, "Rua Almirante Lamego",          "780", null,         CENTRO,         CIDADE, "SC", "88015-000"),
				new OrderAddress(null, "Rua Adolfo Konder",             "160", null,         AGRONOMICA,     CIDADE, "SC", "88025-000"),
				new OrderAddress(null, "Rua Gen. Eurico Gaspar Dutra",  "90",  null,         ESTREITO,       CIDADE, "SC", "88075-000"),
				new OrderAddress(null, "Rua Santos Dumont",             "411", null,         COQUEIROS,      CIDADE, "SC", "88080-000"),
				new OrderAddress(null, "Rua Lauro Müller",              "232", null,         ESTREITO,       CIDADE, "SC", "88072-000"),
				new OrderAddress(null, "Rua Anita Garibaldi",           "670", null,         AGRONOMICA,     CIDADE, "SC", "88025-200"),
				// Abril [18..23]
				new OrderAddress(null, "Rua Presidente Coutinho",       "780", null,         CENTRO,         CIDADE, "SC", "88015-230"),
				new OrderAddress(null, "Rua Jerônimo Coelho",           "100", null,         CENTRO,         CIDADE, "SC", "88010-030"),
				new OrderAddress(null, "Av. Othon Gama D'Eça",          "900", null,         CENTRO,         CIDADE, "SC", "88015-240"),
				new OrderAddress(null, "Rua Arno Hoeschl",              "55",  null,         ITACORUBI,      CIDADE, "SC", "88034-250"),
				new OrderAddress(null, "Rua Desemb. Vitor Lima",        "344", null,         TRINDADE,       CIDADE, "SC", "88040-400"),
				new OrderAddress(null, "Rua João Pinto",                "53",  null,         CENTRO,         CIDADE, "SC", "88010-530"),
				// Maio [24..29]
				new OrderAddress(null, "Rua Esteves Júnior",            "295", null,         CENTRO,         CIDADE, "SC", "88015-130"),
				new OrderAddress(null, "Rua dos Açores",                "650", null,         CAMPECHE,       CIDADE, "SC", "88063-100"),
				new OrderAddress(null, "Rua Prof. Milton Sulivan",      "110", null,         CORREGO_GRANDE, CIDADE, "SC", "88037-300"),
				new OrderAddress(null, "Rua João Pio Duarte Silva",     "188", null,         CORREGO_GRANDE, CIDADE, "SC", CEP_CORREGO),
				new OrderAddress(null, "Rua Delfino Conti",             "400", null,         PANTANAL,       CIDADE, "SC", "88040-370"),
				new OrderAddress(null, "Rua Balthazar Buschle",         "120", null,         CARVOEIRA,      CIDADE, "SC", "88040-550"),
				// Junho [30..35]
				new OrderAddress(null, "Rua Silveira de Souza",         "218", null,         AGRONOMICA,     CIDADE, "SC", "88025-200"),
				new OrderAddress(null, "Rua do Antão",                  "88",  null,         INGLESES,       CIDADE, "SC", "88058-000"),
				new OrderAddress(null, "Rua dos Turistas",              "310", null,         "Canasvieiras", CIDADE, "SC", "88054-000"),
				new OrderAddress(null, "Rua José Henrique Boiteux",     "75",  null,         "Ipiranga",     CIDADE, "SC", "88030-000"),
				new OrderAddress(null, "Rua Victor Meireles",           "430", null,         CENTRO,         CIDADE, "SC", "88015-400"),
				new OrderAddress(null, "Rua Eng. Osvaldo Reis",         "200", null,         COQUEIROS,      CIDADE, "SC", "88080-200"),
				// Mês atual — entregues [36..37]
				new OrderAddress(null, "Rua Padre Roma",                "95",  null,         CENTRO,         CIDADE, "SC", "88010-090"),
				new OrderAddress(null, "Rua Frei Caneca",               "310", null,         TRINDADE,       CIDADE, "SC", "88036-540"),
				// Mês atual — pedidos do dia [38..40]
				new OrderAddress(null, "Rua Lauro Linhares",            "450", "Casa Verde", TRINDADE,       CIDADE, "SC", "88036-002"),
				new OrderAddress(null, "Av. Beira Mar Norte",           "780", null,         AGRONOMICA,     CIDADE, "SC", "88025-000"),
				new OrderAddress(null, "Rua Desemb. Pedro Silva",       "1100",null,         COQUEIROS,      CIDADE, "SC", "88080-700")
		)).toArray(new OrderAddress[0]);

		LocalDate hoje = LocalDate.now();

		// Os pedidos entregues do mês atual ficam nos primeiros dias do mês.
		// Garante que o dia seja válido mesmo que hoje seja dia 1 ou 2.
		LocalDate inicioMes1 = hoje.withDayOfMonth(hoje.getDayOfMonth() > 2 ? 2 : 1);
		LocalDate inicioMes2 = hoje.withDayOfMonth(hoje.getDayOfMonth() > 3 ? 3 : 2);

		// Janeiro
		List<Order> jan = orderRepository.saveAll(Arrays.asList(
				mkMaterial(p.get(0), c.get(3),  oa[0],  5.0, 7.25, d(1, 8),  manha,  null,                750.00, 750.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(1), c.get(4),  oa[1],  3.0, 4.50, d(1,12),  tarde1, null,                450.00, 450.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(4), c.get(5),  oa[2],  4.0, 5.20, d(1,16),  tarde2, "Deixar no quintal", 600.00, 600.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(2), c.get(6),  oa[3],  2.0, 2.84, d(1,22),  manha,  null,                300.00, 300.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkServico( p.get(1), c.get(7),  oa[4],  "Espalhamento de brita",  d(1,25), tarde1,         530.00, 530.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(5), c.get(8),  oa[5],  5.0, 6.75, d(1,29),  tarde2, null,                750.00, 750.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID)
		));
		paymentRepository.saveAll(Arrays.asList(
				mkPayment(jan.get(0), 750.00, d(1, 8),  PaymentMethodEnum.PIX),
				mkPayment(jan.get(1), 450.00, d(1,12),  PaymentMethodEnum.CASH),
				mkPayment(jan.get(2), 600.00, d(1,16),  PaymentMethodEnum.BANK_TRANSFER),
				mkPayment(jan.get(3), 300.00, d(1,22),  PaymentMethodEnum.PIX),
				mkPayment(jan.get(4), 530.00, d(1,25),  PaymentMethodEnum.CASH),
				mkPayment(jan.get(5), 750.00, d(1,29),  PaymentMethodEnum.BANK_TRANSFER)
		));

		// Fevereiro
		List<Order> fev = orderRepository.saveAll(Arrays.asList(
				mkMaterial(p.get(0), c.get(9),  oa[6],  3.0, 4.35, d(2, 5),  manha,  null,               480.00, 480.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(1), c.get(10), oa[7],  5.0, 7.50, d(2,10),  tarde1, null,               850.00, 850.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkServico( p.get(4), c.get(0),  oa[8],  "Nivelamento de pátio",   d(2,14), tarde2,        600.00, 600.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(2), c.get(1),  oa[9],  4.0, 5.68, d(2,19),  manha,  null,               650.00, 650.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(3), c.get(2),  oa[10], 3.0, 4.14, d(2,24),  tarde1, null,               550.00, 550.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(5), c.get(3),  oa[11], 2.0, 2.70, d(2,27),  tarde2, null,               400.00, 400.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID)
		));
		paymentRepository.saveAll(Arrays.asList(
				mkPayment(fev.get(0), 480.00, d(2, 5),  PaymentMethodEnum.PIX),
				mkPayment(fev.get(1), 850.00, d(2,10),  PaymentMethodEnum.CASH),
				mkPayment(fev.get(2), 600.00, d(2,14),  PaymentMethodEnum.BANK_TRANSFER),
				mkPayment(fev.get(3), 650.00, d(2,19),  PaymentMethodEnum.PIX),
				mkPayment(fev.get(4), 550.00, d(2,24),  PaymentMethodEnum.CASH),
				mkPayment(fev.get(5), 400.00, d(2,27),  PaymentMethodEnum.BANK_TRANSFER)
		));

		// Março
		List<Order> mar = orderRepository.saveAll(Arrays.asList(
				mkMaterial(p.get(0), c.get(4),  oa[12], 5.0, 7.25, d(3, 3),  manha,  null,              800.00, 800.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(1), c.get(5),  oa[13], 3.0, 4.50, d(3, 8),  tarde1, null,              480.00, 480.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkServico( p.get(2), c.get(6),  oa[14], "Compactação de base",    d(3,13), tarde2,       650.00, 650.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(4), c.get(7),  oa[15], 5.0, 6.50, d(3,19),  manha,  "Portão de ferro", 760.00, 760.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(5), c.get(8),  oa[16], 2.0, 2.70, d(3,24),  tarde1, null,              300.00, 300.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(3), c.get(9),  oa[17], 4.0, 5.52, d(3,28),  tarde2, null,              750.00, 750.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID)
		));
		paymentRepository.saveAll(Arrays.asList(
				mkPayment(mar.get(0), 800.00, d(3, 3),  PaymentMethodEnum.PIX),
				mkPayment(mar.get(1), 480.00, d(3, 8),  PaymentMethodEnum.CASH),
				mkPayment(mar.get(2), 650.00, d(3,13),  PaymentMethodEnum.BANK_TRANSFER),
				mkPayment(mar.get(3), 760.00, d(3,19),  PaymentMethodEnum.PIX),
				mkPayment(mar.get(4), 300.00, d(3,24),  PaymentMethodEnum.CASH),
				mkPayment(mar.get(5), 750.00, d(3,28),  PaymentMethodEnum.BANK_TRANSFER)
		));

		// Abril
		List<Order> abr = orderRepository.saveAll(Arrays.asList(
				mkMaterial(p.get(1), c.get(10), oa[18], 5.0, 7.50, d(4, 4),  manha,  null,                 850.00, 850.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkServico( p.get(0), c.get(11), oa[19], "Espalhamento de pedrisco", d(4, 9),  tarde1,       500.00, 500.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(2), c.get(0),  oa[20], 4.0, 5.68, d(4,15),  tarde2, null,                 680.00, 680.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(4), c.get(1),  oa[21], 3.0, 3.90, d(4,21),  manha,  null,                 460.00, 460.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(5), c.get(2),  oa[22], 2.0, 2.70, d(4,25),  tarde1, null,                 300.00, 300.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(3), c.get(3),  oa[23], 3.0, 4.14, d(4,29),  tarde2, "Obra no fim da rua", 460.00, 460.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID)
		));
		paymentRepository.saveAll(Arrays.asList(
				mkPayment(abr.get(0), 850.00, d(4, 4),  PaymentMethodEnum.PIX),
				mkPayment(abr.get(1), 500.00, d(4, 9),  PaymentMethodEnum.CASH),
				mkPayment(abr.get(2), 680.00, d(4,15),  PaymentMethodEnum.BANK_TRANSFER),
				mkPayment(abr.get(3), 460.00, d(4,21),  PaymentMethodEnum.PIX),
				mkPayment(abr.get(4), 300.00, d(4,25),  PaymentMethodEnum.CASH),
				mkPayment(abr.get(5), 460.00, d(4,29),  PaymentMethodEnum.BANK_TRANSFER)
		));

		// Maio
		List<Order> mai = orderRepository.saveAll(Arrays.asList(
				mkMaterial(p.get(0), c.get(4),  oa[24], 5.0, 7.25, d(5, 6),  manha,  null,               700.00, 700.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(1), c.get(5),  oa[25], 5.0, 7.50, d(5,10),  tarde1, null,               850.00, 850.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkServico( p.get(4), c.get(6),  oa[26], "Nivelamento de terreno", d(5,15), tarde2,        700.00, 700.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(2), c.get(7),  oa[27], 3.0, 4.26, d(5,20),  manha,  null,               510.00, 510.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(5), c.get(8),  oa[28], 4.0, 5.40, d(5,24),  tarde1, null,               650.00, 650.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(3), c.get(9),  oa[29], 2.0, 2.76, d(5,29),  tarde2, null,               650.00, 650.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID)
		));
		paymentRepository.saveAll(Arrays.asList(
				mkPayment(mai.get(0), 700.00, d(5, 6),  PaymentMethodEnum.PIX),
				mkPayment(mai.get(1), 850.00, d(5,10),  PaymentMethodEnum.CASH),
				mkPayment(mai.get(2), 700.00, d(5,15),  PaymentMethodEnum.BANK_TRANSFER),
				mkPayment(mai.get(3), 510.00, d(5,20),  PaymentMethodEnum.PIX),
				mkPayment(mai.get(4), 650.00, d(5,24),  PaymentMethodEnum.CASH),
				mkPayment(mai.get(5), 650.00, d(5,29),  PaymentMethodEnum.BANK_TRANSFER)
		));

		// Junho
		List<Order> jun = orderRepository.saveAll(Arrays.asList(
				mkMaterial(p.get(0), c.get(10), oa[30], 5.0, 7.25, d(6, 5),  manha,  null,              750.00, 750.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(1), c.get(11), oa[31], 4.0, 6.00, d(6,10),  tarde1, null,              680.00, 680.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkServico( p.get(2), c.get(0),  oa[32], "Compactação de base",   d(6,16), tarde2,        650.00, 650.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(4), c.get(1),  oa[33], 5.0, 6.50, d(6,20),  manha,  null,              760.00, 760.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(5), c.get(2),  oa[34], 3.0, 4.05, d(6,25),  tarde1, null,              500.00, 500.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(3), c.get(3),  oa[35], 2.0, 2.76, d(6,28),  tarde2, null,              700.00, 700.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID)
		));
		paymentRepository.saveAll(Arrays.asList(
				mkPayment(jun.get(0), 750.00, d(6, 5),  PaymentMethodEnum.PIX),
				mkPayment(jun.get(1), 680.00, d(6,10),  PaymentMethodEnum.CASH),
				mkPayment(jun.get(2), 650.00, d(6,16),  PaymentMethodEnum.BANK_TRANSFER),
				mkPayment(jun.get(3), 760.00, d(6,20),  PaymentMethodEnum.PIX),
				mkPayment(jun.get(4), 500.00, d(6,25),  PaymentMethodEnum.CASH),
				mkPayment(jun.get(5), 700.00, d(6,28),  PaymentMethodEnum.BANK_TRANSFER)
		));

		// Mês atual
		List<Order> mesAtualEntregues = orderRepository.saveAll(Arrays.asList(
				mkMaterial(p.get(0), c.get(4), oa[36], 5.0, 7.25, inicioMes1, manha,  null, 750.00, 750.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID),
				mkMaterial(p.get(4), c.get(5), oa[37], 3.0, 3.90, inicioMes2, tarde1, null, 480.00, 480.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PAID)
		));
		paymentRepository.saveAll(Arrays.asList(
				mkPayment(mesAtualEntregues.get(0), 750.00, inicioMes1, PaymentMethodEnum.PIX),
				mkPayment(mesAtualEntregues.get(1), 480.00, inicioMes2, PaymentMethodEnum.CASH)
		));

		// Pedidos do dia — PENDING
		orderRepository.saveAll(Arrays.asList(
				mkMaterial(p.get(2), c.get(6), oa[38], 4.0, 5.68, hoje, LocalTime.of( 8, 0), "Chegar antes das 9h", 680.00, 0.00, OrderStatusEnum.PENDING, PaymentStatusEnum.PENDING),
				mkServico( p.get(0), c.get(7), oa[39], "Espalhamento de brita",               hoje, LocalTime.of(10, 0),        550.00, 0.00, OrderStatusEnum.PENDING, PaymentStatusEnum.PENDING),
				mkMaterial(p.get(4), c.get(8), oa[40], 5.0, 6.50, hoje, LocalTime.of(14, 0), "Ligar antes de sair", 760.00, 0.00, OrderStatusEnum.PENDING, PaymentStatusEnum.PENDING)
		));

		// Cobranças antigas — entregues há ~2 meses, fora do filtro do mês atual.
		// Ficam visíveis apenas ao clicar em "Ver todas" na tela de cobranças.
		LocalDate duasMesAtras = hoje.minusMonths(2).withDayOfMonth(10);

		OrderAddress oaAntiga1 = orderAddressRepository.save(
				new OrderAddress(null, "Rua Silva Jardim", "320", null,     CENTRO, CIDADE, "SC", "88020-200")
		);
		OrderAddress oaAntiga2 = orderAddressRepository.save(
				new OrderAddress(null, "Rua Bocaiúva",     "1870", "Sala 3", CENTRO, CIDADE, "SC", "88015-530")
		);

		// Pedido totalmente não pago
		orderRepository.save(
				mkMaterial(p.get(1), c.get(9),  oaAntiga1, 3.0, 4.50, duasMesAtras,             manha,  null, 480.00, 0.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PENDING)
		);

		// Pedido parcialmente pago — cliente pagou R$200 dos R$680, restam R$480
		Order antigaParcial = orderRepository.save(
				mkMaterial(p.get(3), c.get(11), oaAntiga2, 5.0, 6.90, duasMesAtras.plusDays(4), tarde1, null, 680.00, 200.00, OrderStatusEnum.DELIVERED, PaymentStatusEnum.PARTIAL)
		);
		paymentRepository.save(mkPayment(antigaParcial, 200.00, duasMesAtras.plusDays(4), PaymentMethodEnum.CASH));
	}

	// Despesas

	private void seedExpenses() {

		LocalDate hoje = LocalDate.now();

		// Templates de despesas fixas
		FixedExpense fxAluguel   = fixedExpenseRepository.save(new FixedExpense(null, "Aluguel Galpão",        BigDecimal.valueOf(600.00), "Imóvel"));
		FixedExpense fxSindicato = fixedExpenseRepository.save(new FixedExpense(null, "Mensalidade Sindicato", BigDecimal.valueOf( 80.00), "Sindicato"));
		FixedExpense fxJornal    = fixedExpenseRepository.save(new FixedExpense(null, "Jornal",                BigDecimal.valueOf( 20.00), CAT_ESCRITORIO));
		FixedExpense fxContabil  = fixedExpenseRepository.save(new FixedExpense(null, "Honorários Contábeis",  BigDecimal.valueOf(200.00), "Contabilidade"));
		FixedExpense fxInternet  = fixedExpenseRepository.save(new FixedExpense(null, "Internet",              BigDecimal.valueOf( 99.90), CAT_ESCRITORIO));

		FixedExpense[] fixas = { fxAluguel, fxSindicato, fxJornal, fxContabil, fxInternet };

		// Janeiro
		saveFixasMes(fixas, 1);
		expenseRepository.saveAll(Arrays.asList(
				variavel("Manutenção caminhão",    400.00, d(1,12), CAT_MECANICA),
				variavel("Material de escritório",  80.00, d(1,20), CAT_ESCRITORIO),
				variavel("Seguro caminhão",         200.00, d(1,28), "Seguros"),
				fuelExpense(370.00, d(1,18))
		));
		saveAbastecimento(d(1,18), 310.0, 61.36, POSTO_DOM_BOSCO);

		// Fevereiro
		saveFixasMes(fixas, 2);
		expenseRepository.saveAll(Arrays.asList(
				variavel("Troca de óleo",           220.00, d(2, 8), CAT_MECANICA),
				variavel("Limpeza pátio",            80.00, d(2,16), CAT_MANUTENCAO),
				variavel("Compra de EPI",           130.00, d(2,23), "Segurança"),
				fuelExpense(440.00, d(2,15))
		));
		saveAbastecimento(d(2,15), 340.0, 72.97, AUTO_POSTO_CENTRAL);

		// Março
		saveFixasMes(fixas, 3);
		expenseRepository.saveAll(Arrays.asList(
				variavel("Conserto balança",         350.00, d(3, 7), CAT_EQUIPAMENTOS),
				variavel("Impressão documentos",      45.00, d(3,14), CAT_ESCRITORIO),
				variavel("Revisão periódica caminhão",475.00, d(3,20), CAT_MECANICA),
				fuelExpense(370.00, d(3,12))
		));
		saveAbastecimento(d(3,12), 260.0, 61.36, POSTO_DOM_BOSCO);

		// Abril
		saveFixasMes(fixas, 4);
		expenseRepository.saveAll(Arrays.asList(
				variavel("Limpeza depósito",         180.00, d(4, 9), CAT_MANUTENCAO),
				variavel("Compra ferramentas",       250.00, d(4,17), CAT_EQUIPAMENTOS),
				variavel("Conserto portão",          170.00, d(4,24), CAT_MANUTENCAO),
				fuelExpense(450.00, d(4,16))
		));
		saveAbastecimento(d(4,16), 360.0, 74.63, AUTO_POSTO_CENTRAL);

		// Maio
		saveFixasMes(fixas, 5);
		expenseRepository.saveAll(Arrays.asList(
				variavel("Reparo elétrico",          430.00, d(5, 8), CAT_MANUTENCAO),
				variavel("Recarga gás compressor",    90.00, d(5,15), CAT_EQUIPAMENTOS),
				variavel("Pintura galpão",           650.00, d(5,22), CAT_MANUTENCAO),
				fuelExpense(450.00, d(5,19))
		));
		saveAbastecimento(d(5,19), 360.0, 74.63, POSTO_DOM_BOSCO);

		// Junho
		saveFixasMes(fixas, 6);
		expenseRepository.saveAll(Arrays.asList(
				variavel("Compra pneus",             580.00, d(6, 6), CAT_MECANICA),
				variavel("Manutenção balança",       155.00, d(6,13), CAT_EQUIPAMENTOS),
				variavel("Material de escritório",    95.00, d(6,20), CAT_ESCRITORIO),
				fuelExpense(430.00, d(6,17))
		));
		saveAbastecimento(d(6,17), 310.0, 71.31, AUTO_POSTO_CENTRAL);

		// Mês atual
		LocalDate diaPrimeiro = hoje.withDayOfMonth(1);
		LocalDate vencimento  = hoje.plusMonths(1).withDayOfMonth(5);

		expenseRepository.saveAll(Arrays.asList(
				// Fixas já pagas no início do mês
				fixaMes(fxAluguel,   diaPrimeiro),
				fixaMes(fxSindicato, diaPrimeiro),
				fixaMes(fxJornal,    diaPrimeiro),
				// Fixas ainda pendentes
				new Expense(null, fxContabil.getName(), fxContabil.getDefaultValue(),
						diaPrimeiro, vencimento, null,
						ExpenseTypeEnum.FIXED, PaymentStatusEnum.PENDING, fxContabil.getCategory()),
				new Expense(null, fxInternet.getName(), fxInternet.getDefaultValue(),
						diaPrimeiro, vencimento, null,
						ExpenseTypeEnum.FIXED, PaymentStatusEnum.PENDING, fxInternet.getCategory()),
				// Variáveis do mês
				variavel("Conserto pneu caminhão", 150.00, hoje.minusDays(5), CAT_MECANICA),
				variavel("Limpeza escritório",      60.00, hoje.minusDays(2), CAT_ESCRITORIO),
				fuelExpense(250.00, hoje.minusDays(3))
		));
		saveAbastecimento(hoje.minusDays(3), 100.0, 41.46, POSTO_DOM_BOSCO);
	}

	// Helpers

	// Pedido de material. Remaining é zero para PAID e igual ao total para PENDING/PARTIAL
	private Order mkMaterial(Product p, Client c, OrderAddress oa,
			double qtdM3, double qtdTon,
			LocalDate date, LocalTime time, String obs,
			double total, double amountPaid,
			OrderStatusEnum status, PaymentStatusEnum payStatus) {
		double remaining = total - amountPaid;
		return new Order(null, p, c, oa, qtdM3, qtdTon, null,
				OrderTypeEnum.MATERIAL, date, time, obs,
				status, payStatus,
				BigDecimal.valueOf(total), BigDecimal.valueOf(remaining));
	}

	// Pedido de serviço - obs é sempre nulo neste conjunto de dados, por isso omitido
	private Order mkServico(Product p, Client c, OrderAddress oa,
			String servico,
			LocalDate date, LocalTime time,
			double total, double amountPaid,
			OrderStatusEnum status, PaymentStatusEnum payStatus) {
		double remaining = total - amountPaid;
		return new Order(null, p, c, oa, null, null, servico,
				OrderTypeEnum.SERVICE, date, time, null,
				status, payStatus,
				BigDecimal.valueOf(total), BigDecimal.valueOf(remaining));
	}

	// Instancia um pagamento com valor e data explícitos — sem depender de getters de Order
	private Payment mkPayment(Order order, double value, LocalDate date, PaymentMethodEnum method) {
		return new Payment(null, order, BigDecimal.valueOf(value), date, method);
	}

	// Salva as 5 despesas fixas como pagas para o mês indicado
	private void saveFixasMes(FixedExpense[] fixas, int mes) {
		expenseRepository.saveAll(Arrays.asList(
				fixaMes(fixas[0], d(mes, 5)),
				fixaMes(fixas[1], d(mes, 5)),
				fixaMes(fixas[2], d(mes, 5)),
				fixaMes(fixas[3], d(mes, 10)),
				fixaMes(fixas[4], d(mes, 10))
		));
	}

	// Instancia uma despesa fixa paga a partir do template (vence no mês seguinte)
	private Expense fixaMes(FixedExpense fx, LocalDate date) {
		return new Expense(null, fx.getName(), fx.getDefaultValue(),
				date, date.plusMonths(1), date,
				ExpenseTypeEnum.FIXED, PaymentStatusEnum.PAID, fx.getCategory());
	}

	// Instancia uma despesa variável paga
	private Expense variavel(String name, double value, LocalDate date, String category) {
		return new Expense(null, name, BigDecimal.valueOf(value),
				date, null, date,
				ExpenseTypeEnum.VARIABLE, PaymentStatusEnum.PAID, category);
	}

	// Instancia uma despesa de combustível paga para o caminhão padrão
	// (o registro de Fuel é salvo separadamente via saveAbastecimento)
	private Expense fuelExpense(double value, LocalDate date) {
		return new Expense(null, CAMINHAO, BigDecimal.valueOf(value),
				date, null, date,
				ExpenseTypeEnum.FUEL, PaymentStatusEnum.PAID, "Combustível");
	}

	// Busca a despesa de combustível pela data e salva o registro de abastecimento.
	// Deve ser chamado logo após o saveAll que inclui o fuelExpense correspondente.
	private void saveAbastecimento(LocalDate date, double km, double liters, String posto) {
		expenseRepository.findAll().stream()
				.filter(e -> e.getType() == ExpenseTypeEnum.FUEL
						&& e.getDate().equals(date))
				.findFirst()
				.ifPresent(ex -> fuelRepository.save(
						new Fuel(null, ex, CAMINHAO, km, liters, PRECO_LITRO, posto)));
	}
}

package br.ufsc.aggregare.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Client;
import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.OrderAddress;
import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.dto.OrderInputDTO;
import br.ufsc.aggregare.model.dto.PaymentInputDTO;
import br.ufsc.aggregare.model.dto.PaymentInsertDTO;
import br.ufsc.aggregare.model.enums.OrderStatusEnum;
import br.ufsc.aggregare.model.enums.OrderTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;
import br.ufsc.aggregare.repository.OrderAddressRepository;
import br.ufsc.aggregare.repository.OrderRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;
import br.ufsc.aggregare.validator.OrderValidator;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

	private final OrderRepository orderRepository;
	private final OrderAddressRepository orderAddressRepository;
	private final ProductService productService;
	private final ClientService clientService;
	private final PaymentService paymentService;
	private final StockService stockService;
	private final OrderValidator orderValidator;

	@Autowired
	public OrderService(OrderRepository orderRepository, OrderAddressRepository orderAddressRepository,
			ProductService productService, ClientService clientService, PaymentService paymentService,
			StockService stockService, OrderValidator orderValidator) {
		this.orderRepository = orderRepository;
		this.orderAddressRepository = orderAddressRepository;
		this.productService = productService;
		this.clientService = clientService;
		this.paymentService = paymentService;
		this.stockService = stockService;
		this.orderValidator = orderValidator;
	}

	@Transactional
	public Order insert(OrderInputDTO dto) {
		orderValidator.validate(dto);

		Order order = orderFromInputDTO(dto);
		orderRepository.save(order);

		if (hasValidStockData(order)) {
			try {
				Double tonQuantity = stockService.deductStockForOrder(order.getProduct(), order.getM3Quantity());
				order.setTonQuantity(tonQuantity);
				orderRepository.save(order);
			} catch (ObjectOptimisticLockingFailureException e) {
				throw new IllegalStateException("O estoque foi modificado por outra operação simultânea. Tente novamente.");
			}
		}

		return order;
	}

	@Transactional
	public void delete(Long id) {
		Order existingOrder = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		if (hasValidStockData(existingOrder)) {
			try {
				stockService.restoreStockForOrder(
						existingOrder.getProduct(),
						existingOrder.getM3Quantity(),
						existingOrder.getTonQuantity() != null ? existingOrder.getTonQuantity() : 0.0);
			} catch (ObjectOptimisticLockingFailureException e) {
				throw new IllegalStateException("O estoque foi modificado por outra operação simultânea. Tente novamente.");
			}
		}

		orderAddressRepository.delete(existingOrder.getOrderAddress());
		orderRepository.delete(existingOrder);
	}

	@Transactional
	public Order update(Long id, OrderInputDTO dto) {
		orderValidator.validate(dto);

		Order existingOrder = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		try {
			if (hasValidStockData(existingOrder)) {
				stockService.restoreStockForOrder(
						existingOrder.getProduct(),
						existingOrder.getM3Quantity(),
						existingOrder.getTonQuantity() != null ? existingOrder.getTonQuantity() : 0.0);
			}

			if (dto.getType() == OrderTypeEnum.MATERIAL) {
				Product existingProduct = productService.findById(dto.getProductId());
				existingOrder.setProduct(existingProduct);
				existingOrder.setM3Quantity(dto.getM3Quantity());
			} else {
				existingOrder.setProduct(null);
				existingOrder.setM3Quantity(null);
				existingOrder.setTonQuantity(null);
			}

			Client existingClient = clientService.findById(dto.getClientId());
			existingOrder.setClient(existingClient);

			updateOrderAddress(existingOrder.getOrderAddress(), dto);
			updateOrder(existingOrder, dto);

			if (hasValidStockData(existingOrder)) {
				Double tonQuantity = stockService.deductStockForOrder(existingOrder.getProduct(), existingOrder.getM3Quantity());
				existingOrder.setTonQuantity(tonQuantity);
			}
		} catch (ObjectOptimisticLockingFailureException e) {
			throw new IllegalStateException("O estoque foi modificado por outra operação simultânea. Tente novamente.");
		}

		return existingOrder;
	}

	private void updateOrder(Order existingOrder, OrderInputDTO dto) {
		existingOrder.setService(dto.getService());
		existingOrder.setType(dto.getType());
		existingOrder.setScheduledDate(dto.getScheduledDate());
		existingOrder.setScheduledTime(dto.getScheduledTime());
		existingOrder.setObservations(dto.getObservations());
		existingOrder.setOrderValue(dto.getOrderValue());
		paymentService.updateOrderPaymentState(existingOrder);
	}

	private void updateOrderAddress(OrderAddress existingOrderAddress, OrderInputDTO dto) {
		existingOrderAddress.setStreet(dto.getStreet());
		existingOrderAddress.setNumber(dto.getNumber());
		existingOrderAddress.setNeighborhood(dto.getNeighborhood());
		existingOrderAddress.setCity(dto.getCity());
		existingOrderAddress.setState(dto.getState());
	}

	@Transactional
	public Order markAsDelivered(Long id) {
		Order existingOrder = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		existingOrder.setStatus(OrderStatusEnum.DELIVERED);
		orderRepository.save(existingOrder);
		return existingOrder;
	}

	@Transactional
	public Order addPayment(Long id, PaymentInputDTO paymentDTO) {
		Order existingOrder = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		PaymentInsertDTO dto = new PaymentInsertDTO();
		dto.setOrderId(id);
		dto.setPaymentValue(paymentDTO.getPaymentValue());
		dto.setPaymentMethod(paymentDTO.getPaymentMethod());
		dto.setDate(paymentDTO.getDate());

		paymentService.insert(dto);

		return existingOrder;
	}

	public Order findById(Long id) {
		return orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public List<Order> findAll() {
		return orderRepository.findAll();
	}

	public List<Order> findByScheduledDate(LocalDate scheduledDate) {
		return orderRepository.findByScheduledDate(scheduledDate);
	}

	private Order orderFromInputDTO(OrderInputDTO dto) {
		Order order = new Order();

		if (dto.getType() == OrderTypeEnum.MATERIAL) {
			Product existingProduct = productService.findById(dto.getProductId());
			order.setProduct(existingProduct);
			order.setM3Quantity(dto.getM3Quantity());
		} else {
			order.setProduct(null);
			order.setM3Quantity(null);
			order.setTonQuantity(null);
		}

		Client existingClient = clientService.findById(dto.getClientId());
		order.setClient(existingClient);

		OrderAddress orderAddress = orderAddressFromDTO(dto);
		orderAddressRepository.save(orderAddress);
		order.setOrderAddress(orderAddress);

		order.setService(dto.getService());
		order.setType(dto.getType());
		order.setScheduledDate(dto.getScheduledDate());
		order.setScheduledTime(dto.getScheduledTime());
		order.setObservations(dto.getObservations());
		order.setStatus(OrderStatusEnum.PENDING);
		order.setPaymentStatus(PaymentStatusEnum.PENDING);
		order.setOrderValue(dto.getOrderValue());
		order.setRemainingValue(dto.getOrderValue());

		return order;
	}

	private OrderAddress orderAddressFromDTO(OrderInputDTO dto) {
		OrderAddress orderAddress = new OrderAddress();
		orderAddress.setStreet(dto.getStreet());
		orderAddress.setNumber(dto.getNumber());
		orderAddress.setNeighborhood(dto.getNeighborhood());
		orderAddress.setCity(dto.getCity());
		orderAddress.setState(dto.getState());
		return orderAddress;
	}

	private boolean hasValidStockData(Order order) {
		return order.getType() == OrderTypeEnum.MATERIAL
				&& order.getProduct() != null
				&& order.getM3Quantity() != null
				&& order.getM3Quantity() > 0;
	}
}

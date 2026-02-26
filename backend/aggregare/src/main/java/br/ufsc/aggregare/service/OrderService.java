package br.ufsc.aggregare.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Client;
import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.OrderAddress;
import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.dto.OrderInputDTO;
import br.ufsc.aggregare.model.dto.PaymentInputDTO;
import br.ufsc.aggregare.model.enums.OrderStatusEnum;
import br.ufsc.aggregare.model.enums.OrderTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;
import br.ufsc.aggregare.repository.OrderAddressRepository;
import br.ufsc.aggregare.repository.OrderRepository;
import br.ufsc.aggregare.service.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

	private final OrderRepository orderRepository;
	private final OrderAddressRepository orderAddressRepository;
	private final ProductService productService;
	private final ClientService clientService;
	private final PaymentService paymentService;
	private final StockService stockService;

	@Autowired
	public OrderService(OrderRepository orderRepository, OrderAddressRepository orderAddressRepository,
			ProductService productService, ClientService clientService, PaymentService paymentService, StockService stockService) {
		this.orderRepository = orderRepository;
		this.orderAddressRepository = orderAddressRepository;
		this.productService = productService;
		this.clientService = clientService;
		this.paymentService = paymentService;
		this.stockService = stockService;
	}

	@Transactional
	public Order insert(OrderInputDTO dto) {
		validateMaterialOrder(dto);

		Order order = orderFromInputDTO(dto);
		orderRepository.save(order);

		if (order.getType() == OrderTypeEnum.MATERIAL && order.getProduct() != null) {
			stockService.deductStockForOrder(order.getProduct(), order.getQuantity());
		}

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

	private Order orderFromInputDTO(OrderInputDTO dto) {
		Order order = new Order();

		if (dto.getType() == OrderTypeEnum.MATERIAL) {
			Product existingProduct = productService.findById(dto.getProductId());
			order.setProduct(existingProduct);
			order.setQuantity(dto.getQuantity());
		} else {
			order.setProduct(null);
			order.setQuantity(null);
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

		return order;
	}

	@Transactional
	public void delete(Long id) {
		Order existingOrder = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		if (existingOrder.getType() == OrderTypeEnum.MATERIAL && existingOrder.getProduct() != null) {
			stockService.restoreStockForOrder(existingOrder.getProduct(), existingOrder.getQuantity());
		}

		OrderAddress existingOrderAddress = existingOrder.getOrderAddress();
		orderAddressRepository.delete(existingOrderAddress);
		orderRepository.delete(existingOrder);
	}

	@Transactional
	public Order update(Long id, OrderInputDTO dto) {
		validateMaterialOrder(dto);

		Order existingOrder = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));

		if (existingOrder.getType() == OrderTypeEnum.MATERIAL && existingOrder.getProduct() != null) {
			stockService.restoreStockForOrder(existingOrder.getProduct(), existingOrder.getQuantity());
		}

		if (dto.getType() == OrderTypeEnum.MATERIAL) {
			Product existingProduct = productService.findById(dto.getProductId());
			existingOrder.setProduct(existingProduct);
			existingOrder.setQuantity(dto.getQuantity());
		} else {
			existingOrder.setProduct(null);
			existingOrder.setQuantity(null);
		}

		Client existingClient = clientService.findById(dto.getClientId());
		existingOrder.setClient(existingClient);

		OrderAddress existingOrderAddress = existingOrder.getOrderAddress();
		updateOrderAddress(existingOrderAddress, dto);
		updateOrder(existingOrder, dto);

		if (existingOrder.getType() == OrderTypeEnum.MATERIAL && existingOrder.getProduct() != null) {
			stockService.deductStockForOrder(existingOrder.getProduct(), existingOrder.getQuantity());
		}

		return existingOrder;
	}

	private void updateOrderAddress(OrderAddress existingOrderAddress, OrderInputDTO dto) {
		existingOrderAddress.setStreet(dto.getStreet());
		existingOrderAddress.setNumber(dto.getNumber());
		existingOrderAddress.setNeighborhood(dto.getNeighborhood());
		existingOrderAddress.setCity(dto.getCity());
		existingOrderAddress.setState(dto.getState());
	}

	private void updateOrder(Order existingOrder, OrderInputDTO dto) {
		existingOrder.setService(dto.getService());
		existingOrder.setType(dto.getType());
		existingOrder.setScheduledDate(dto.getScheduledDate());
		existingOrder.setScheduledTime(dto.getScheduledTime());
		existingOrder.setObservations(dto.getObservations());
		existingOrder.setOrderValue(dto.getOrderValue());
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

		paymentService.insert(existingOrder, paymentDTO.getPaymentValue(), paymentDTO.getPaymentMethod());

		return orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	private void validateMaterialOrder(OrderInputDTO dto) {
		if (dto.getType() == OrderTypeEnum.MATERIAL) {
			if (dto.getProductId() == null) {
				throw new IllegalArgumentException("Pedido do tipo MATERIAL deve conter um produto.");
			}
			if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
				throw new IllegalArgumentException("Pedido do tipo MATERIAL deve conter uma quantidade válida.");
			}
		}
	}
}

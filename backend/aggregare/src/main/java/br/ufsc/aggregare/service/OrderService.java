package br.ufsc.aggregare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufsc.aggregare.model.Client;
import br.ufsc.aggregare.model.Order;
import br.ufsc.aggregare.model.OrderAddress;
import br.ufsc.aggregare.model.Product;
import br.ufsc.aggregare.model.dto.OrderInputDTO;
import br.ufsc.aggregare.model.enums.OrderStatusEnum;
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

	@Autowired
	public OrderService(OrderRepository orderRepository, OrderAddressRepository orderAddressRepository, ProductService productService, ClientService clientService) {
		this.orderRepository = orderRepository;
		this.orderAddressRepository = orderAddressRepository;
		this.productService = productService;
		this.clientService = clientService;
	}

	@Transactional
	public Order insert(OrderInputDTO dto) {
		Order order = orderFromInputDTO(dto);
		orderRepository.save(order);
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

		Product existingProduct = productService.findById(dto.getProductId());
		order.setProduct(existingProduct);

		Client existingClient = clientService.findById(dto.getClientId());
		order.setClient(existingClient);

		OrderAddress orderAddress = orderAddressFromDTO(dto);
		orderAddressRepository.save(orderAddress);
		order.setOrderAddress(orderAddress);

		order.setQuantity(dto.getQuantity());
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
}

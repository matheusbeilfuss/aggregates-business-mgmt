package br.ufsc.aggregare.model.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import br.ufsc.aggregare.model.enums.OrderTypeEnum;

public class OrderInputDTO {

	private Long productId;
	private Long clientId;

	private String street;
	private String number;
	private String neighborhood;
	private String city;
	private String state;

	private Double quantity;
	private String service;
	private OrderTypeEnum type;
	private LocalDate scheduledDate;
	private LocalTime scheduledTime;
	private String observations;
	private Double orderValue;

	public OrderInputDTO() {
	}

	public OrderInputDTO(Long productId, Long clientId, String street, String number, String neighborhood, String city, String state, Double quantity, String service, OrderTypeEnum type, LocalDate scheduledDate, LocalTime scheduledTime, String observations, Double orderValue) {
		this.productId = productId;
		this.clientId = clientId;
		this.street = street;
		this.number = number;
		this.neighborhood = neighborhood;
		this.city = city;
		this.state = state;
		this.quantity = quantity;
		this.service = service;
		this.type = type;
		this.scheduledDate = scheduledDate;
		this.scheduledTime = scheduledTime;
		this.observations = observations;
		this.orderValue = orderValue;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Double getOrderValue() {
		return orderValue;
	}

	public void setOrderValue(Double orderValue) {
		this.orderValue = orderValue;
	}

	public String getObservations() {
		return observations;
	}

	public void setObservations(String observations) {
		this.observations = observations;
	}

	public LocalTime getScheduledTime() {
		return scheduledTime;
	}

	public void setScheduledTime(LocalTime scheduledTime) {
		this.scheduledTime = scheduledTime;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getNeighborhood() {
		return neighborhood;
	}

	public void setNeighborhood(String neighborhood) {
		this.neighborhood = neighborhood;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public Double getQuantity() {
		return quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
	}

	public OrderTypeEnum getType() {
		return type;
	}

	public void setType(OrderTypeEnum type) {
		this.type = type;
	}

	public LocalDate getScheduledDate() {
		return scheduledDate;
	}

	public void setScheduledDate(LocalDate scheduledDate) {
		this.scheduledDate = scheduledDate;
	}
}

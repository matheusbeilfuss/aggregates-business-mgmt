package br.ufsc.aggregare.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import br.ufsc.aggregare.model.enums.OrderTypeEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class OrderInputDTO {

	private Long productId;

	@NotNull(message = "O cliente é obrigatório.")
	private Long clientId;

	@NotBlank(message = "A rua é obrigatória.")
	private String street;

	@NotBlank(message = "O número é obrigatório.")
	private String number;

	private String complement;

	@NotBlank(message = "O bairro é obrigatório.")
	private String neighborhood;

	@NotBlank(message = "A cidade é obrigatória.")
	private String city;

	@NotBlank(message = "O estado é obrigatório.")
	@Size(min = 2, message = "O estado deve ter pelo menos 2 caracteres.")
	private String state;

	private String cep;

	private Double m3Quantity;
	private String service;

	@NotNull(message = "O tipo do pedido é obrigatório.")
	private OrderTypeEnum type;

	@NotNull(message = "A data agendada é obrigatória.")
	private LocalDate scheduledDate;

	@NotNull(message = "O horário agendado é obrigatório.")
	private LocalTime scheduledTime;

	private String observations;

	@NotNull(message = "O valor do pedido é obrigatório.")
	@Positive(message = "O valor do pedido deve ser maior que zero.")
	private BigDecimal orderValue;

	public OrderInputDTO() {
	}

	public OrderInputDTO(Long productId, Long clientId, String street, String number, String complement, String neighborhood, String city, String state, String cep,
			Double m3Quantity,
			String service, OrderTypeEnum type, LocalDate scheduledDate, LocalTime scheduledTime, String observations, BigDecimal orderValue) {
		this.productId = productId;
		this.clientId = clientId;
		this.street = street;
		this.number = number;
		this.complement = complement;
		this.neighborhood = neighborhood;
		this.city = city;
		this.state = state;
		this.cep = cep;
		this.m3Quantity = m3Quantity;
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

	public String getComplement() {
		return complement;
	}

	public void setComplement(String complement) {
		this.complement = complement;
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

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	public Double getM3Quantity() {
		return m3Quantity;
	}

	public void setM3Quantity(Double m3Quantity) {
		this.m3Quantity = m3Quantity;
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

	public LocalTime getScheduledTime() {
		return scheduledTime;
	}

	public void setScheduledTime(LocalTime scheduledTime) {
		this.scheduledTime = scheduledTime;
	}

	public String getObservations() {
		return observations;
	}

	public void setObservations(String observations) {
		this.observations = observations;
	}

	public BigDecimal getOrderValue() {
		return orderValue;
	}

	public void setOrderValue(BigDecimal orderValue) {
		this.orderValue = orderValue;
	}
}

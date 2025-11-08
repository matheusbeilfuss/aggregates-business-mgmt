package br.ufsc.aggregare.model;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

import br.ufsc.aggregare.model.enums.OrderStatusEnum;
import br.ufsc.aggregare.model.enums.OrderTypeEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_order")
public class Order implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "client_id")
	private Client client;

	@ManyToOne
	@JoinColumn(name = "address_id")
	private Address address;

	private LocalDate date;
	private LocalTime deliveryTime;

	@Enumerated(EnumType.STRING)
	private OrderTypeEnum type;

	@Enumerated(EnumType.STRING)
	private OrderStatusEnum status;

	private String observations;
	private Boolean paid;
	private Double paidValue;
	private String paymentMethod;

	public Order() {
	}

	public Order(Long id, Client client, Address address, LocalDate date, LocalTime deliveryTime, OrderTypeEnum type, OrderStatusEnum status, String observations, Boolean paid,
			Double paidValue, String paymentMethod) {
		this.id = id;
		this.client = client;
		this.address = address;
		this.date = date;
		this.deliveryTime = deliveryTime;
		this.type = type;
		this.status = status;
		this.observations = observations;
		this.paid = paid;
		this.paidValue = paidValue;
		this.paymentMethod = paymentMethod;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Client getClient() {
		return client;
	}

	public void setClient(Client client) {
		this.client = client;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public LocalTime getDeliveryTime() {
		return deliveryTime;
	}

	public void setDeliveryTime(LocalTime deliveryTime) {
		this.deliveryTime = deliveryTime;
	}

	public OrderTypeEnum getType() {
		return type;
	}

	public void setType(OrderTypeEnum type) {
		this.type = type;
	}

	public OrderStatusEnum getStatus() {
		return status;
	}

	public void setStatus(OrderStatusEnum status) {
		this.status = status;
	}

	public String getObservations() {
		return observations;
	}

	public void setObservations(String observations) {
		this.observations = observations;
	}

	public Boolean getPaid() {
		return paid;
	}

	public void setPaid(Boolean paid) {
		this.paid = paid;
	}

	public Double getPaidValue() {
		return paidValue;
	}

	public void setPaidValue(Double paidValue) {
		this.paidValue = paidValue;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		Order order = (Order) o;
		return Objects.equals(id, order.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

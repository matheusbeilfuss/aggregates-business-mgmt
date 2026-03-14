package br.ufsc.aggregare.model.dto;

import br.ufsc.aggregare.model.enums.OrderTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ReceivableDTO {

	private Long id;
	private Long clientId;
	private String clientName;
	private OrderTypeEnum type;
	private String productName;
	private String service;
	private LocalDate scheduledDate;
	private LocalTime scheduledTime;
	private BigDecimal orderValue;
	private BigDecimal remainingValue;
	private PaymentStatusEnum paymentStatus;

	public ReceivableDTO() {
	}

	public ReceivableDTO(Long id, Long clientId, String clientName, OrderTypeEnum type, String productName, String service, LocalDate scheduledDate, LocalTime scheduledTime,
			BigDecimal orderValue,
			BigDecimal remainingValue, PaymentStatusEnum paymentStatus) {
		this.id = id;
		this.clientId = clientId;
		this.clientName = clientName;
		this.type = type;
		this.productName = productName;
		this.service = service;
		this.scheduledDate = scheduledDate;
		this.scheduledTime = scheduledTime;
		this.orderValue = orderValue;
		this.remainingValue = remainingValue;
		this.paymentStatus = paymentStatus;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public OrderTypeEnum getType() {
		return type;
	}

	public void setType(OrderTypeEnum type) {
		this.type = type;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
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

	public BigDecimal getOrderValue() {
		return orderValue;
	}

	public void setOrderValue(BigDecimal orderValue) {
		this.orderValue = orderValue;
	}

	public BigDecimal getRemainingValue() {
		return remainingValue;
	}

	public void setRemainingValue(BigDecimal remainingValue) {
		this.remainingValue = remainingValue;
	}

	public PaymentStatusEnum getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatusEnum paymentStatus) {
		this.paymentStatus = paymentStatus;
	}
}

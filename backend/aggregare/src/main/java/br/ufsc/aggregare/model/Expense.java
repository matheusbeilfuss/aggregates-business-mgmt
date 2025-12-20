package br.ufsc.aggregare.model;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import br.ufsc.aggregare.model.enums.ExpenseTypeEnum;
import br.ufsc.aggregare.model.enums.PaymentStatusEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_expense")
public class Expense implements Serializable {
	@Serial private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private Double value;
	private LocalDate date;
	private LocalDate dueDate;
	private LocalDate paymentDate;

	@Enumerated(EnumType.STRING)
	private ExpenseTypeEnum type;

	@Enumerated(EnumType.STRING)
	private PaymentStatusEnum paymentStatus;

	private String category;

	public Expense() {
	}

	public Expense(Long id, String name, Double value, LocalDate date, LocalDate dueDate, LocalDate paymentDate, ExpenseTypeEnum type, PaymentStatusEnum paymentStatus,
			String category) {
		this.id = id;
		this.name = name;
		this.value = value;
		this.date = date;
		this.dueDate = dueDate;
		this.paymentDate = paymentDate;
		this.type = type;
		this.paymentStatus = paymentStatus;
		this.category = category;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getValue() {
		return value;
	}

	public void setValue(Double value) {
		this.value = value;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public LocalDate getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
	}

	public ExpenseTypeEnum getType() {
		return type;
	}

	public void setType(ExpenseTypeEnum type) {
		this.type = type;
	}

	public PaymentStatusEnum getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatusEnum paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Override public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass())
			return false;
		Expense expense = (Expense) o;
		return Objects.equals(id, expense.id);
	}

	@Override public int hashCode() {
		return Objects.hashCode(id);
	}
}

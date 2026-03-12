import { ExpenseFormValues } from "../schemas/expense.schemas";
import { ExpenseInputDTO } from "../types";

export function toExpenseInputDTO(values: ExpenseFormValues): ExpenseInputDTO {
  return {
    name: values.name,
    expenseValue: values.expenseValue,
    date: values.date,
    type: values.type,
    paymentStatus: values.paymentStatus,
    category: values.category,
    dueDate: values.dueDate || null,
    paymentDate: values.paymentDate || null,
    vehicle: values.vehicle || null,
    kmDriven: values.kmDriven ?? null,
    liters: values.liters ?? null,
    pricePerLiter: values.pricePerLiter ?? null,
    fuelSupplier: values.fuelSupplier || null,
  };
}

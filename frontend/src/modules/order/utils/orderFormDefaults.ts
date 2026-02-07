import { OrderFormData } from "../schemas/order.schemas";
import { toISODate } from "./toIsoDate";

export const orderFormDefaults: OrderFormData = {
  scheduledDate: toISODate(new Date()),
  type: "MATERIAL",
  clientName: "",
  clientId: undefined,
  phone: "",
  cpfCnpj: "",
  state: "",
  city: "",
  neighborhood: "",
  street: "",
  number: "",
  productId: undefined,
  service: "",
  quantity: undefined,
  orderValue: undefined,
  scheduledTime: "",
  observations: "",
};

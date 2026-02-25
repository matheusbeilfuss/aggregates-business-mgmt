import { Navigate, useParams } from "react-router-dom";
import { OrderEditForm } from "../components/OrderEditForm";
import { usePageTitle } from "@/hooks/usePageTitle";

export function OrderEdit() {
  usePageTitle("Editar pedido");

  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  if (!id || Number.isNaN(orderId)) {
    return <Navigate to="/orders" replace />;
  }

  return <OrderEditForm orderId={orderId} />;
}

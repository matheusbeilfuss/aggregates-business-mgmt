import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageContainer } from "@/components/shared/PageContainer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ExpenseForm } from "../components/ExpenseForm";
import { useFixedExpenses } from "../hooks/useFixedExpenses";
import { ExpenseFormValues } from "../schemas/expense.schemas";
import { ApiError } from "@/lib/api";
import { useExpense } from "../hooks/useExpense";
import { LoadingState } from "@/components/shared";
import { ExpenseTypeEnum } from "@/types";
import { expenseService } from "../services/expense.service";
import { ExpenseInputDTO } from "../types";
import { toExpenseInputDTO } from "../utils/expenseDTO";
import { useEffect } from "react";

export default function ExpenseEdit() {
  usePageTitle("Editar saída");

  const navigate = useNavigate();

  const { id } = useParams();
  const expenseId = Number(id);

  const { data: templates, refetch: refetchTemplates } = useFixedExpenses();
  const { data: expense, loading, error } = useExpense(expenseId);

  useEffect(() => {
    if (error) {
      toast.error("Não foi possível carregar a saída.");
      navigate("/finance?tab=expenses");
    }
  }, [error, navigate]);

  if (!id || Number.isNaN(expenseId) || expenseId <= 0) {
    return <Navigate to="/finance?tab=expenses" replace />;
  }

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      const dto: ExpenseInputDTO = toExpenseInputDTO(values);
      await expenseService.update(expenseId, dto);

      toast.success("Saída atualizada com sucesso.");
      navigate("/finance?tab=expenses");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível atualizar a saída.");
      }
    }
  };

  return (
    <PageContainer title="Editar saída">
      {loading || !expense ? (
        <LoadingState />
      ) : (
        <ExpenseForm
          defaultValues={
            expense.type === ExpenseTypeEnum.FUEL
              ? {
                  ...expense,
                  dueDate: expense.dueDate ?? undefined,
                  paymentDate: expense.paymentDate ?? undefined,
                  vehicle: expense.vehicle ?? undefined,
                  fuelSupplier: expense.fuelSupplier ?? undefined,
                }
              : {
                  ...expense,
                  dueDate: expense.dueDate ?? undefined,
                  paymentDate: expense.paymentDate ?? undefined,
                }
          }
          templates={templates ?? []}
          onTemplatesRefetch={refetchTemplates}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />
      )}
    </PageContainer>
  );
}

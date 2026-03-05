import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageContainer } from "@/components/shared/PageContainer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ExpenseForm } from "../components/ExpenseForm";
import { useFixedExpenses } from "../hooks/useFixedExpenses";
import { ExpenseFormValues } from "../schemas/expense.schema";
import { api } from "@/lib/api";
import { useExpense } from "../hooks/useExpense";
import { LoadingState } from "@/components/shared";

export default function ExpenseEdit() {
  usePageTitle("Editar saída");
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: templates, refetch: refetchTemplates } = useFixedExpenses();
  const { data: expense, loading } = useExpense(id ? parseInt(id) : null);

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      await api.put(`/expenses/${id}`, values);
      toast.success("Saída atualizada com sucesso.");
      navigate("/finance?tab=expenses");
    } catch {
      toast.error("Erro ao atualizar saída.");
    }
  };

  return (
    <PageContainer title="Editar saída">
      {loading || !expense ? (
        <LoadingState />
      ) : (
        <ExpenseForm
          defaultValues={{
            ...expense,
            category: expense.category ?? "",
            dueDate: expense.dueDate ?? undefined,
            paymentDate: expense.paymentDate ?? undefined,
            vehicle: expense.vehicle ?? undefined,
            fuelSupplier: expense.fuelSupplier ?? undefined,
          }}
          templates={templates ?? []}
          onTemplatesRefetch={refetchTemplates}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />
      )}
    </PageContainer>
  );
}

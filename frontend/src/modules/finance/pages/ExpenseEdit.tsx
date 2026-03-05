import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageContainer } from "@/components/shared/PageContainer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ExpenseForm } from "../components/ExpenseForm";
import { useFixedExpenses } from "../hooks/useFixedExpenses";
import { ExpenseFormValues } from "../schemas/expense.schema";
import { api } from "@/lib/api";
import { useExpense } from "../hooks/useExpense";

export default function ExpenseEdit() {
  usePageTitle("Editar saída");
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: templates, refetch: refetchTemplates } = useFixedExpenses();
  const { data: expense } = useExpense(id ? parseInt(id) : null);
  // ideal: criar useExpense(id) similar ao useOrder(id) já existente
  // por ora, busca direta via api ou adapta useFinanceExpenses

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      await api.put(`/expenses/${id}`, values);
      toast.success("Saída atualizada com sucesso.");
      navigate(-1);
    } catch {
      toast.error("Erro ao atualizar saída.");
    }
  };

  return (
    <PageContainer title="Editar saída">
      <ExpenseForm
        defaultValues={expense ?? undefined}
        templates={templates ?? []}
        onTemplatesRefetch={refetchTemplates}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </PageContainer>
  );
}

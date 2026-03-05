import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageContainer } from "@/components/shared/PageContainer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ExpenseForm } from "../components/ExpenseForm";
import { useFixedExpenses } from "../hooks/useFixedExpenses";
import { ExpenseFormValues } from "../schemas/expense.schema";
import { api } from "@/lib/api";

export default function ExpenseAdd() {
  usePageTitle("Adicionar saída");
  const navigate = useNavigate();
  const { data: templates, refetch } = useFixedExpenses();

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      await api.post("/expenses", values);
      toast.success("A saída foi criada com sucesso.");
      navigate("/finance?tab=expenses");
    } catch {
      toast.error("Não foi possível criar a saída.");
    }
  };

  return (
    <PageContainer title="Adicionar saída">
      <ExpenseForm
        templates={templates ?? []}
        onTemplatesRefetch={refetch}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </PageContainer>
  );
}

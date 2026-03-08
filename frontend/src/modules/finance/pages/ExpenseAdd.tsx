import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageContainer } from "@/components/shared/PageContainer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ExpenseForm } from "../components/ExpenseForm";
import { useFixedExpenses } from "../hooks/useFixedExpenses";
import { ExpenseFormValues } from "../schemas/expense.schemas";
import { ApiError } from "@/lib/api";
import { expenseService } from "../services/expense.service";
import { ExpenseInputDTO } from "../types";

export default function ExpenseAdd() {
  usePageTitle("Adicionar saída");
  const navigate = useNavigate();
  const { data: templates, refetch } = useFixedExpenses();

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      const dto: ExpenseInputDTO = {
        name: values.name,
        expenseValue: values.expenseValue,
        date: values.date,
        type: values.type,
        paymentStatus: values.paymentStatus,
        category: values.category,
        dueDate: values.dueDate ?? null,
        paymentDate: values.paymentDate ?? null,
        vehicle: values.vehicle ?? null,
        kmDriven: values.kmDriven ?? null,
        liters: values.liters ?? null,
        pricePerLiter: values.pricePerLiter ?? null,
        fuelSupplier: values.fuelSupplier ?? null,
      };

      await expenseService.create(dto);

      toast.success("A saída foi criada com sucesso.");
      navigate("/finance?tab=expenses");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível criar a saída.");
      }
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

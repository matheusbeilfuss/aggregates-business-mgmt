import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FormActionsProps {
  cancelPath: string;
  submitLabel?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function FormActions({
  cancelPath,
  submitLabel = "Salvar",
  onSubmit,
  isSubmitting = false,
}: FormActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-auto flex justify-end gap-4 py-12">
      <Button
        type="button"
        variant="outline"
        className="px-6 py-6 text-base cursor-pointer"
        onClick={() => navigate(cancelPath)}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>

      <Button
        type={onSubmit ? "button" : "submit"}
        className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base cursor-pointer"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : submitLabel}
      </Button>
    </div>
  );
}

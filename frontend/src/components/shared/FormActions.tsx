import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FormActionsProps {
  cancelPath?: string;
  onCancel?: () => void;
  submitLabel?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  formId?: string;
}

export function FormActions({
  cancelPath,
  onCancel,
  submitLabel = "Salvar",
  onSubmit,
  isSubmitting = false,
  formId,
}: FormActionsProps) {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) onCancel();
    else if (cancelPath) navigate(cancelPath);
  };

  return (
    <div className="mt-auto flex justify-end gap-4 py-12">
      <Button
        type="button"
        variant="outline"
        className="px-6 py-6 text-base cursor-pointer"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>

      <Button
        type={onSubmit ? "button" : "submit"}
        form={!onSubmit ? formId : undefined}
        className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base cursor-pointer"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : submitLabel}
      </Button>
    </div>
  );
}

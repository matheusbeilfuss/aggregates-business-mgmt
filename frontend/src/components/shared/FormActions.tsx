import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type FormActionsProps = {
  submitLabel?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  formId?: string;
} & (
  | { onCancel: () => void; cancelPath?: never }
  | { cancelPath: string; onCancel?: never }
);

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
    <div className="max-w-3xl mx-auto w-full mt-auto flex justify-end gap-3 pt-8 pb-4">
      <Button
        type="button"
        variant="outline"
        className="px-6 h-10 text-sm cursor-pointer"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>

      <Button
        type={onSubmit ? "button" : "submit"}
        form={!onSubmit ? formId : undefined}
        className="px-6 h-10 text-sm font-medium text-white cursor-pointer
                 hover:opacity-90 active:opacity-80 transition-opacity"
        style={{ backgroundColor: "var(--color-primary-40)" }}
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : submitLabel}
      </Button>
    </div>
  );
}

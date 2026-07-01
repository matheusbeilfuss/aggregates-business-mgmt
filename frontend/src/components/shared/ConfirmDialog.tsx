import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert, CheckCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  descriptionAlign?: "center" | "justify" | "left";
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Você tem certeza?",
  description,
  descriptionAlign = "left",
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive",
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  const alignClass = {
    center: "text-center",
    justify: "text-justify",
    left: "text-left",
  }[descriptionAlign];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[400px] gap-0">
        <AlertDialogHeader className="text-left">
          <div className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full mt-0.5"
              style={{
                backgroundColor: isDestructive
                  ? "var(--color-error-container)"
                  : "var(--color-primary-90)",
              }}
            >
              {isDestructive ? (
                <TriangleAlert
                  className="h-4 w-4"
                  style={{ color: "var(--color-error)" }}
                />
              ) : (
                <CheckCircle
                  className="h-4 w-4"
                  style={{ color: "var(--color-primary-40)" }}
                />
              )}
            </div>
            <div>
              <AlertDialogTitle className="leading-tight text-base">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className={`mt-1 text-sm ${alignClass}`}>
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="mt-6 flex justify-end gap-2">
          <AlertDialogCancel className="cursor-pointer h-9 px-4 text-sm">
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            className="cursor-pointer h-9 px-4 text-sm font-medium text-white
                       hover:opacity-90 active:opacity-80 transition-opacity"
            style={{
              backgroundColor: isDestructive
                ? "var(--color-error)"
                : "var(--color-primary-40)",
            }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

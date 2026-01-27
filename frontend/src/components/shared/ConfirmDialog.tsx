import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
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
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive",
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            {isDestructive && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <TriangleAlert className="h-5 w-5 text-red-600" />
              </div>
            )}
            <div className="text-left">
              <AlertDialogTitle className="leading-tight">
                {title}
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription className="mt-4 text-base text-foreground text-center">
          {description}
        </AlertDialogDescription>

        <div className="mt-6 flex justify-end gap-4">
          <AlertDialogCancel className="cursor-pointer">
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            className={
              isDestructive
                ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                : "cursor-pointer"
            }
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

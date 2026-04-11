import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RenameCategoryDialogProps {
  open: boolean;
  currentName: string;
  newName: string;
  onNewNameChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RenameCategoryDialog({
  open,
  currentName,
  newName,
  onNewNameChange,
  onConfirm,
  onCancel,
}: RenameCategoryDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Renomear categoria</DialogTitle>
          <DialogDescription>
            O novo nome será refletido em todos os preços e fornecedores
            vinculados a <strong>{currentName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={newName}
          onChange={(e) => onNewNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newName.trim() && onConfirm()}
          placeholder="Nome da categoria"
          className="mt-1"
          autoFocus
        />

        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="outline"
            className="h-9 px-4 text-sm cursor-pointer"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            className="h-9 px-4 text-sm font-medium text-white cursor-pointer
                       hover:opacity-90 active:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--color-primary-40)" }}
            onClick={onConfirm}
            disabled={!newName.trim()}
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

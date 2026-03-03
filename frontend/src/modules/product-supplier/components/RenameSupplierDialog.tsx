import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RenameSupplierDialogProps {
  open: boolean;
  currentName: string;
  newName: string;
  onNewNameChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RenameSupplierDialog({
  open,
  currentName,
  newName,
  onNewNameChange,
  onConfirm,
  onCancel,
}: RenameSupplierDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear fornecedor</DialogTitle>
          <DialogDescription>
            O novo nome será refletido em todos os produtos vinculados a{" "}
            <strong>{currentName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={newName}
          onChange={(e) => onNewNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onConfirm()}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            className="bg-slate-500 hover:bg-slate-600 text-white"
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

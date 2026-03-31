import { useNavigate } from "react-router-dom";
import { Pencil, MoreHorizontal, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductSupplier } from "@/modules/product-supplier/types";

interface SupplierActionsProps {
  ps: ProductSupplier;
  categoryId: number;
  onRename: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function SupplierActions({
  ps,
  categoryId,
  onRename,
  onDelete,
}: SupplierActionsProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onSelect={() => onRename(ps.supplierId, ps.supplierName)}
        >
          <Tag className="h-4 w-4" />
          Renomear
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            navigate(
              `/prices/categories/${categoryId}/suppliers/${ps.id}/edit`,
            );
          }}
        >
          <Pencil className="h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 cursor-pointer text-destructive
                     focus:text-destructive focus:bg-destructive/10"
          onSelect={() => onDelete(ps.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

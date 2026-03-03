import { useNavigate } from "react-router-dom";
import { Pencil, X, MoreHorizontal, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 md:h-8 md:w-8 cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => onRename(ps.supplierId, ps.supplierName)}
        >
          <Tag className="mr-2 h-4 w-4" />
          Renomear
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            navigate(
              `/prices/categories/${categoryId}/suppliers/${ps.id}/edit`,
            );
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500 cursor-pointer"
          onSelect={() => onDelete(ps.id)}
        >
          <X className="mr-2 h-4 w-4 text-red-500" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  year: number;
  onChange: (year: number) => void;
};

export function YearPicker({ year, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Ano anterior"
        onClick={() => onChange(year - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="text-sm font-medium w-12 text-center">{year}</span>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Próximo ano"
        onClick={() => onChange(year + 1)}
        disabled={year >= new Date().getFullYear()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

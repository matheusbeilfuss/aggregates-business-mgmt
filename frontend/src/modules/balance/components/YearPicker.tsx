import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  year: number;
  onChange: (year: number) => void;
};

export function YearPicker({ year, onChange }: Props) {
  return (
    <div
      className="flex items-center gap-1 rounded-lg border px-1 py-1"
      style={{ borderColor: "var(--color-outline-variant)" }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        aria-label="Ano anterior"
        onClick={() => onChange(year - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span
        className="text-sm font-semibold w-12 text-center select-none"
        style={{ color: "var(--color-on-surface)" }}
      >
        {year}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        aria-label="Próximo ano"
        onClick={() => onChange(year + 1)}
        disabled={year >= new Date().getFullYear()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

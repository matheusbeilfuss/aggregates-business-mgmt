import { DatePicker } from "@/components/shared/DatePicker";
import { FinancePeriod } from "../types";

type Props = {
  period: FinancePeriod;
  onChange: (period: FinancePeriod) => void;
};

export function FinancePeriodPicker({ period, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <DatePicker
        value={period.startDate}
        onChange={(date) => date && onChange({ ...period, startDate: date })}
      />
      <span className="text-muted-foreground text-sm">até</span>
      <DatePicker
        value={period.endDate}
        onChange={(date) => date && onChange({ ...period, endDate: date })}
      />
    </div>
  );
}

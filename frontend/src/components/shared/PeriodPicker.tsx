import { DatePeriod } from "@/types";
import { DatePicker } from "./DatePicker";

type Props = {
  period: DatePeriod;
  onChange: (period: DatePeriod) => void;
  disabled?: boolean;
};

export function PeriodPicker({ period, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <DatePicker
        value={period.startDate}
        onChange={(date) => date && onChange({ ...period, startDate: date })}
        disabled={disabled}
      />
      <span className="text-muted-foreground text-sm">até</span>
      <DatePicker
        value={period.endDate}
        onChange={(date) => date && onChange({ ...period, endDate: date })}
        disabled={disabled}
      />
    </div>
  );
}

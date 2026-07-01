import { DatePeriod } from "@/types";
import { DatePicker } from "./DatePicker";

type Props = {
  period: DatePeriod;
  onChange: (period: DatePeriod) => void;
  disabled?: boolean;
};

export function PeriodPicker({ period, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2">
      <DatePicker
        value={period.startDate}
        onChange={(date) => date && onChange({ ...period, startDate: date })}
        disabled={disabled}
      />
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground text-sm">até</span>
        <DatePicker
          value={period.endDate}
          onChange={(date) => date && onChange({ ...period, endDate: date })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

import { DatePicker } from "./DatePicker";

export type Period = {
  startDate: Date;
  endDate: Date;
};

type Props = {
  period: Period;
  onChange: (period: Period) => void;
};

export function PeriodPicker({ period, onChange }: Props) {
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

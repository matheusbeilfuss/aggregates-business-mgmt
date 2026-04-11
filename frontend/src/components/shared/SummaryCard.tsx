import { ElementType } from "react";

interface SummaryCardProps {
  label: string;
  value: string;
  icon: ElementType | string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  className?: string;
}

export function SummaryCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  valueColor,
  className = "",
}: SummaryCardProps) {
  return (
    <div
      className={`flex items-center gap-2 md:gap-3 rounded-xl px-3 py-2.5 md:px-5 md:py-4 ${className}`}
      style={{ backgroundColor: "var(--color-surface-container)" }}
    >
      <div
        className="flex items-center justify-center w-7 h-7 md:w-10 md:h-10 rounded-lg shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {typeof Icon === "string" ? (
          <span
            className="text-xs md:text-sm font-bold"
            style={{ color: iconColor }}
          >
            {Icon}
          </span>
        ) : (
          <Icon
            className="h-3.5 w-3.5 md:h-5 md:w-5"
            style={{ color: iconColor }}
          />
        )}
      </div>
      <div className="min-w-0">
        <p
          className="text-[9px] md:text-[10px] font-medium uppercase tracking-wide"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {label}
        </p>
        <p
          className="text-xs md:text-base font-semibold tabular-nums truncate"
          style={{ color: valueColor }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

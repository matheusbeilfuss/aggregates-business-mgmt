import { ElementType, ReactNode } from "react";

interface FormSectionProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
}

export function FormSection({ icon: Icon, title, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
          style={{ backgroundColor: "var(--color-primary-90)" }}
        >
          <Icon
            className="h-3.5 w-3.5"
            style={{ color: "var(--color-primary-40)" }}
          />
        </div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "var(--color-outline-variant)" }}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

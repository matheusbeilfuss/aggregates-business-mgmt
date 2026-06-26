import { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  children,
  actions,
}: PageContainerProps) {
  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between gap-4 px-6 md:px-10 py-6 border-b border-border bg-background shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </header>

      <div className="flex-1 overflow-x-hidden px-6 md:px-10 py-6">
        {children}
      </div>
    </div>
  );
}

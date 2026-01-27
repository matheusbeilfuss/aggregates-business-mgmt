import { Layout } from "@/components/layout/Layout";
import { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  children,
}: PageContainerProps) {
  return (
    <Layout>
      <div className="flex flex-col mx-auto w-[80%] h-full">
        <div className="py-15 text-center">
          <h1 className="text-3xl">{title}</h1>
          {subtitle && (
            <h2 className="text-xl text-primary font-bold pt-10">{subtitle}</h2>
          )}
        </div>
        {children}
      </div>
    </Layout>
  );
}

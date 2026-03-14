import { useMemo, useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState } from "@/components/shared";
import { PaymentDialog } from "@/components/shared/PaymentDialog";
import { PeriodPicker } from "@/components/shared/PeriodPicker";
import { FinanceTotalBar } from "@/components/shared/FinanceTotalBar";
import { Button } from "@/components/ui/button";
import { ReceivableGroup } from "../components/ReceivableGroup";
import { useReceivables } from "../hooks/useReceivables";
import { Receivable, ReceivableGroup as ReceivableGroupType } from "../types";
import { DatePeriod } from "@/types";
import { OrderForPayment } from "@/modules/order/types";

export default function Receivables() {
  usePageTitle("Cobranças");

  const [showAll, setShowAll] = useState(false);
  const [period, setPeriod] = useState<DatePeriod>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  const [receivableForPayment, setReceivableForPayment] =
    useState<Receivable | null>(null);

  const {
    data: receivables,
    loading,
    error,
    refetch,
  } = useReceivables(
    showAll ? {} : { startDate: period.startDate, endDate: period.endDate },
  );

  const groups = useMemo<ReceivableGroupType[]>(() => {
    if (!receivables) return [];

    const map = new Map<number, Receivable[]>();
    for (const r of receivables) {
      const existing = map.get(r.clientId);
      if (existing) {
        existing.push(r);
      } else {
        map.set(r.clientId, [r]);
      }
    }

    return Array.from(map.entries())
      .map(([clientId, items]) => {
        const total = items.reduce(
          (acc, r) => acc + Number(r.remainingValue),
          0,
        );
        const oldestDate = items.reduce(
          (oldest, r) => (r.scheduledDate < oldest ? r.scheduledDate : oldest),
          items[0].scheduledDate,
        );
        return {
          clientId,
          clientName: items[0].clientName,
          total,
          oldestDate,
          items: items.sort((a, b) =>
            a.scheduledDate.localeCompare(b.scheduledDate),
          ),
        };
      })
      .sort((a, b) => a.oldestDate.localeCompare(b.oldestDate));
  }, [receivables]);

  const grandTotal = useMemo(
    () => groups.reduce((acc, g) => acc + g.total, 0),
    [groups],
  );

  const orderForPayment: OrderForPayment | null = receivableForPayment
    ? {
        id: receivableForPayment.id,
        client: { name: receivableForPayment.clientName },
        product: receivableForPayment.productName
          ? { name: receivableForPayment.productName }
          : null,
        service: receivableForPayment.service,
        scheduledDate: receivableForPayment.scheduledDate,
        scheduledTime: receivableForPayment.scheduledTime,
        orderValue: receivableForPayment.orderValue,
        remainingValue: receivableForPayment.remainingValue,
      }
    : null;

  return (
    <PageContainer title="Cobranças">
      {error && <p className="text-red-500 mb-4">{error.message}</p>}

      <div className="flex flex-col gap-7">
        <div className="flex flex-col items-center gap-7">
          <PeriodPicker
            period={period}
            onChange={(p) => {
              setPeriod(p);
              setShowAll(false);
            }}
            disabled={showAll}
          />
          <Button
            variant={showAll ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Exibindo todas as pendentes" : "Ver todas as pendentes"}
          </Button>
        </div>

        {loading ? (
          <LoadingState />
        ) : groups.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma cobrança pendente{showAll ? "" : " no período selecionado"}.
          </p>
        ) : (
          <div className="flex flex-col gap-2 pb-4">
            {groups.map((group) => (
              <ReceivableGroup
                key={group.clientId}
                group={group}
                onAddPayment={setReceivableForPayment}
              />
            ))}

            <FinanceTotalBar
              label="Total a receber"
              value={grandTotal}
              variant="receivable"
            />
          </div>
        )}
      </div>

      {orderForPayment && (
        <PaymentDialog
          mode="add"
          open={!!receivableForPayment}
          onOpenChange={(open) => {
            if (!open) setReceivableForPayment(null);
          }}
          order={orderForPayment}
          onSuccess={() => {
            setReceivableForPayment(null);
            refetch();
          }}
        />
      )}
    </PageContainer>
  );
}

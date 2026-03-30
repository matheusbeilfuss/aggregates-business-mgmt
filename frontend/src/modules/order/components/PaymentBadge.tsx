export function PaymentBadge({ status }: { status?: string }) {
  const config = {
    PAID: { label: "Pago", bg: "#dcfce7", color: "#15803d" },
    PARTIAL: {
      label: "Parcial",
      bg: "var(--color-secondary-90)",
      color: "var(--color-secondary-40)",
    },
    PENDING: {
      label: "Não pago",
      bg: "var(--color-primary-90)",
      color: "var(--color-primary-40)",
    },
  }[status ?? "PENDING"] ?? {
    label: "Não pago",
    bg: "var(--color-primary-90)",
    color: "var(--color-primary-40)",
  };

  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

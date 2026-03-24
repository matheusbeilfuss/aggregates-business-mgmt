const PALETTE = [
  "#3b82f6",
  "#f97316",
  "#22c55e",
  "#a855f7",
  "#ec4899",
  "#eab308",
  "#14b8a6",
  "#ef4444",
  "#6366f1",
  "#f59e0b",
];

export function generateColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => PALETTE[i % PALETTE.length]);
}

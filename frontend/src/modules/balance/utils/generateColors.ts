const PALETTE = [
  "#0061a4",
  "#9e4300",
  "#4e43e4",
  "#15803d",
  "#ba1a1a",
  "#0891b2",
  "#7c3aed",
  "#b45309",
  "#0f766e",
  "#be185d",
];

export function generateColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => PALETTE[i % PALETTE.length]);
}

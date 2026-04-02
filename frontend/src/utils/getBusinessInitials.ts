const STOP_WORDS = new Set([
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "a",
  "o",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "por",
  "para",
]);

export function getBusinessInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter((w) => !STOP_WORDS.has(w.toLowerCase()))
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

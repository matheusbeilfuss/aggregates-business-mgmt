export function formatLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("pt-BR").format(localDate);
}

// format time 17:10:07.86 to 17:10
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

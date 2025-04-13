export function toLocalDate(date: string | Date): string {
  const localDate = new Date(date);
  return localDate.toLocaleDateString();
}
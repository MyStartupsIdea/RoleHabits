export function russianCount(value: number, one: string, few: string, many: string): string {
  const lastTwo = Math.abs(value) % 100;
  const last = lastTwo % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

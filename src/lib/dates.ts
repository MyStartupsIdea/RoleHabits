export function todayKey(): string {
  const d = new Date();
  return formatDateKey(d);
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getPast7DayKeys(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}

export function dayLabel(key: string): string {
  const d = parseDateKey(key);
  const labels = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return labels[d.getDay()];
}

export function isToday(key: string): boolean {
  return key === todayKey();
}

export function isYesterday(key: string): boolean {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return key === formatDateKey(y);
}

export function computeStreak(activeDates: string[]): number {
  if (activeDates.length === 0) return 0;
  const set = new Set(activeDates);
  let streak = 0;
  const cursor = new Date();
  if (!set.has(formatDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(formatDateKey(cursor))) return 0;
  }
  while (set.has(formatDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

import type { Habit } from "./store";
import { computeStreak } from "./dates";
import { getLevelInfo, type Level } from "./gamification";

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  totalCompleted: number;
  successRate: number;
  categoryBreakdown: CategoryStat[];
  bestStreak: number;
  currentStreak: number;
  totalDaysActive: number;
  level: Level;
  xp: number;
}

export function computeBestStreak(activeDates: string[]): number {
  if (activeDates.length === 0) return 0;
  const sorted = [...activeDates].sort();
  let best = 0;
  let current = 0;
  let prev: Date | null = null;

  for (const key of sorted) {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (prev) {
      const diff = Math.round(
        (date.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) {
        current++;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    best = Math.max(best, current);
    prev = date;
  }
  return best;
}

export function computeAnalytics(
  habits: Habit[],
  completedDates: Record<string, string[]>,
  xp: number
): AnalyticsData {
  const allDateKeys = Object.keys(completedDates).sort();
  const totalCompleted = allDateKeys.reduce(
    (sum, key) => sum + (completedDates[key]?.length ?? 0),
    0
  );

  const activeDates = allDateKeys.filter(
    (key) => (completedDates[key] ?? []).length > 0
  );

  const totalDaysActive = activeDates.length;
  const currentStreak = computeStreak(activeDates);
  const bestStreak = computeBestStreak(activeDates);

  // Success rate: completed today / total habits, averaged over active days
  const successRate =
    totalDaysActive > 0
      ? Math.round(
          (allDateKeys.reduce((sum, key) => {
            const done = completedDates[key]?.length ?? 0;
            return sum + (habits.length > 0 ? done / habits.length : 0);
          }, 0) /
            totalDaysActive) *
            100
        )
      : 0;

  // Category breakdown based on all habits
  const categoryCounts = new Map<string, number>();
  for (const habit of habits) {
    categoryCounts.set(
      habit.category,
      (categoryCounts.get(habit.category) ?? 0) + 1
    );
  }
  const totalForBreakdown = habits.length || 1;
  const categoryBreakdown: CategoryStat[] = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalForBreakdown) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const levelInfo = getLevelInfo(xp);

  return {
    totalCompleted,
    successRate,
    categoryBreakdown,
    bestStreak,
    currentStreak,
    totalDaysActive,
    level: levelInfo.level,
    xp,
  };
}

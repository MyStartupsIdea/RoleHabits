import type { LucideIcon } from "lucide-react";
import {
  Flame,
  Sparkles,
  Trophy,
  Zap,
  Target,
  Award,
  Rocket,
  Crown,
  Medal,
  Star,
} from "lucide-react";
import type { Level } from "./gamification";

export type AchievementId =
  | "first_spark"
  | "week_fire"
  | "senior"
  | "marathon"
  | "early_bird"
  | "habit_master"
  | "xp_master"
  | "perfectionist"
  | "collector"
  | "iron_will"
  | "level_lead"
  | "century";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // tailwind gradient
}

export const achievements: Achievement[] = [
  {
    id: "first_spark",
    title: "Первая искра",
    description: "Выполнить первую привычку",
    icon: Sparkles,
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "week_fire",
    title: "Неделя огня",
    description: "Серия из 7 дней подряд",
    icon: Flame,
    color: "from-orange-400 to-rose-500",
  },
  {
    id: "iron_will",
    title: "Железная воля",
    description: "Серия из 14 дней подряд",
    icon: Flame,
    color: "from-rose-400 to-red-600",
  },
  {
    id: "senior",
    title: "Сеньор",
    description: "Достичь уровня Senior",
    icon: Trophy,
    color: "from-violet-400 to-indigo-500",
  },
  {
    id: "level_lead",
    title: "Лидер",
    description: "Достичь уровня Lead",
    icon: Crown,
    color: "from-amber-300 to-yellow-500",
  },
  {
    id: "marathon",
    title: "Марафонец",
    description: "Выполнить 30 привычек всего",
    icon: Target,
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "century",
    title: "Сотня",
    description: "Выполнить 100 привычек всего",
    icon: Award,
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: "early_bird",
    title: "Жаворонок",
    description: "Выполнить привычку до 9 утра",
    icon: Rocket,
    color: "from-sky-400 to-indigo-500",
  },
  {
    id: "habit_master",
    title: "Мастер привычек",
    description: "Создать 5 кастомных привычек",
    icon: Star,
    color: "from-fuchsia-400 to-pink-500",
  },
  {
    id: "xp_master",
    title: "Магистр XP",
    description: "Накопить 2000 XP",
    icon: Zap,
    color: "from-amber-400 to-yellow-500",
  },
  {
    id: "perfectionist",
    title: "Перфекционист",
    description: "Выполнить все привычки за день",
    icon: Medal,
    color: "from-indigo-400 to-violet-500",
  },
  {
    id: "collector",
    title: "Коллекционер",
    description: "Иметь 10 привычек в списке",
    icon: Award,
    color: "from-teal-400 to-emerald-500",
  },
];

export interface AchievementStats {
  totalCompleted: number;
  currentStreak: number;
  bestStreak: number;
  level: Level;
  xp: number;
  customHabitCount: number;
  totalHabitCount: number;
  hadEarlyBird: boolean;
  hadPerfectDay: boolean;
}

export function getUnlockedAchievements(stats: AchievementStats): Set<AchievementId> {
  const unlocked = new Set<AchievementId>();

  if (stats.totalCompleted >= 1) unlocked.add("first_spark");
  if (stats.currentStreak >= 7 || stats.bestStreak >= 7) unlocked.add("week_fire");
  if (stats.currentStreak >= 14 || stats.bestStreak >= 14) unlocked.add("iron_will");
  if (stats.level === "senior" || stats.level === "lead") unlocked.add("senior");
  if (stats.level === "lead") unlocked.add("level_lead");
  if (stats.totalCompleted >= 30) unlocked.add("marathon");
  if (stats.totalCompleted >= 100) unlocked.add("century");
  if (stats.hadEarlyBird) unlocked.add("early_bird");
  if (stats.customHabitCount >= 5) unlocked.add("habit_master");
  if (stats.xp >= 2000) unlocked.add("xp_master");
  if (stats.hadPerfectDay) unlocked.add("perfectionist");
  if (stats.totalHabitCount >= 10) unlocked.add("collector");

  return unlocked;
}

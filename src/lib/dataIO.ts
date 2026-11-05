import { dailyTargets, experienceLevels, habitTypes, iconMap, primaryGoals, habitFocuses, trackingModes, professionMap } from "../data/professions";
import type { DailyTargetId, Difficulty, ExperienceLevel, HabitType, IconName, ProfessionId, PrimaryGoalId, HabitFocusId, TrackingMode } from "../data/professions";
import type { AppState, Habit } from "./store";
import { achievements } from "./achievements";

const APP_NAME = "RoleHabits";
const BACKUP_VERSION = 1;
const difficulties = new Set<string>(["easy", "medium", "hard"]);
const iconNames = new Set<string>(Object.keys(iconMap));
const professionIds = new Set<string>(Object.keys(professionMap));
const experienceIds = new Set<string>(experienceLevels.map(({ id }) => id));
const dailyTargetIds = new Set<string>(dailyTargets.map(({ id }) => id));
const achievementIds = new Set<string>(achievements.map(({ id }) => id));
const habitTypeIds = new Set<string>(habitTypes);
const primaryGoalIds = new Set<string>(primaryGoals.map(({ id }) => id));
const habitFocusIds = new Set<string>(habitFocuses.map(({ id }) => id));
const trackingModeIds = new Set<string>(trackingModes.map(({ id }) => id));

export function exportData(state: AppState): void {
  const payload = {
    app: APP_NAME,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `rolehabits-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

interface ImportedPayload {
  app?: unknown;
  version?: unknown;
  state?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseHabit(value: unknown): Habit | null {
  if (!isRecord(value)) return null;
  const { id, title, category, minutes, difficulty, icon } = value;
  const type = value.type ?? "active";
  if (
    typeof id !== "string" || !id.trim() || id.length > 120 ||
    typeof title !== "string" || !title.trim() || title.length > 120 ||
    typeof category !== "string" || !category.trim() || category.length > 60 ||
    typeof minutes !== "number" || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440 ||
    typeof difficulty !== "string" || !difficulties.has(difficulty) ||
    typeof icon !== "string" || !iconNames.has(icon) ||
    typeof type !== "string" || !habitTypeIds.has(type)
  ) {
    return null;
  }

  return {
    id: id.trim(),
    title: title.trim(),
    category: category.trim(),
    minutes,
    difficulty: difficulty as Difficulty,
    icon: icon as IconName,
    type: type as HabitType,
    custom: typeof value.custom === "boolean" ? value.custom : true,
  };
}

export function parseImportedFile(text: string): AppState | null {
  try {
    const payload = JSON.parse(text) as unknown;
    if (!isRecord(payload)) return null;

    const wrapped = "state" in payload;
    const envelope = payload as ImportedPayload;
    if (wrapped && (envelope.app !== APP_NAME || envelope.version !== BACKUP_VERSION)) {
      return null;
    }
    const raw = wrapped ? envelope.state : payload;
    if (!isRecord(raw)) return null;

    const {
      onboarded,
      professionId,
      experienceLevel,
      dailyTarget,
      habits: rawHabits,
      completedDates: rawCompletedDates,
      xp,
    } = raw;
    const primaryGoal = raw.primaryGoal ?? "career";
    const habitFocus = raw.habitFocus ?? "balanced";
    const trackingMode = raw.trackingMode ?? "flexible";

    if (
      typeof onboarded !== "boolean" ||
      !(professionId === null || (typeof professionId === "string" && professionIds.has(professionId))) ||
      !(experienceLevel === null || (typeof experienceLevel === "string" && experienceIds.has(experienceLevel))) ||
      !(dailyTarget === null || (typeof dailyTarget === "string" && dailyTargetIds.has(dailyTarget))) ||
      !Array.isArray(rawHabits) || !isRecord(rawCompletedDates) ||
      typeof xp !== "number" || !Number.isSafeInteger(xp) || xp < 0
    ) {
      return null;
    }
    if (
      typeof primaryGoal !== "string" || !primaryGoalIds.has(primaryGoal) ||
      typeof habitFocus !== "string" || !habitFocusIds.has(habitFocus) ||
      typeof trackingMode !== "string" || !trackingModeIds.has(trackingMode)
    ) return null;

    if (onboarded && (!professionId || !experienceLevel || !dailyTarget)) return null;

    const habits = rawHabits.map(parseHabit);
    if (habits.some((habit) => habit === null)) return null;
    const parsedHabits = habits as Habit[];
    const habitIds = new Set(parsedHabits.map(({ id }) => id));
    if (habitIds.size !== parsedHabits.length) return null;

    const completedDates: Record<string, string[]> = {};
    for (const [date, values] of Object.entries(rawCompletedDates)) {
      if (!isValidDateKey(date) || !Array.isArray(values) || values.some((id) => typeof id !== "string")) {
        return null;
      }
      completedDates[date] = [...new Set(values.filter((id): id is string => habitIds.has(id as string)))];
    }

    const bestStreak = raw.bestStreak ?? 0;
    const hadEarlyBird = raw.hadEarlyBird ?? false;
    const hadPerfectDay = raw.hadPerfectDay ?? false;
    const rawUnlockedAchievements = raw.unlockedAchievements ?? [];
    if (
      typeof bestStreak !== "number" || !Number.isSafeInteger(bestStreak) || bestStreak < 0 ||
      typeof hadEarlyBird !== "boolean" || typeof hadPerfectDay !== "boolean" ||
      !Array.isArray(rawUnlockedAchievements) ||
      rawUnlockedAchievements.some((id) => typeof id !== "string" || !achievementIds.has(id))
    ) {
      return null;
    }

    return {
      onboarded,
      professionId: professionId as ProfessionId | null,
      experienceLevel: experienceLevel as ExperienceLevel | null,
      dailyTarget: dailyTarget as DailyTargetId | null,
      primaryGoal: primaryGoal as PrimaryGoalId,
      habitFocus: habitFocus as HabitFocusId,
      trackingMode: trackingMode as TrackingMode,
      habits: parsedHabits,
      completedDates,
      xp,
      bestStreak,
      hadEarlyBird,
      hadPerfectDay,
      unlockedAchievements: [...new Set(rawUnlockedAchievements)] as AppState["unlockedAchievements"],
    };
  } catch {
    return null;
  }
}

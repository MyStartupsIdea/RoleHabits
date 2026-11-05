import { useCallback, useEffect, useState } from "react";
import type {
  ProfessionId,
  ExperienceLevel,
  DailyTargetId,
  Difficulty,
  IconName,
  PrimaryGoalId,
  HabitFocusId,
  TrackingMode,
  HabitType,
} from "../data/professions";
import { habitTypes, professionMap } from "../data/professions";
import { XP_PER_HABIT } from "./gamification";
import { todayKey, computeStreak } from "./dates";
import { computeBestStreak } from "./analytics";
import type { AchievementId } from "./achievements";

export interface Habit {
  id: string;
  title: string;
  category: string;
  minutes: number;
  difficulty: Difficulty;
  icon: IconName;
  type: HabitType;
  custom: boolean;
}

export type HabitDraft = Omit<Habit, "id" | "custom">;

export interface AppState {
  onboarded: boolean;
  professionId: ProfessionId | null;
  experienceLevel: ExperienceLevel | null;
  dailyTarget: DailyTargetId | null;
  primaryGoal: PrimaryGoalId | null;
  habitFocus: HabitFocusId | null;
  trackingMode: TrackingMode | null;
  habits: Habit[];
  completedDates: Record<string, string[]>; // dateKey -> habitIds
  xp: number;
  bestStreak: number;
  hadEarlyBird: boolean;
  hadPerfectDay: boolean;
  unlockedAchievements: AchievementId[];
}

const STORAGE_KEY = "rolehabits:state:v1";

const initialState: AppState = {
  onboarded: false,
  professionId: null,
  experienceLevel: null,
  dailyTarget: null,
  primaryGoal: null,
  habitFocus: null,
  trackingMode: null,
  habits: [],
  completedDates: {},
  xp: 0,
  bestStreak: 0,
  hadEarlyBird: false,
  hadPerfectDay: false,
  unlockedAchievements: [],
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const merged = { ...initialState, ...parsed };
    const legacyProfile = merged.onboarded;
    return {
      ...merged,
      primaryGoal: merged.primaryGoal ?? (legacyProfile ? "career" : null),
      habitFocus: merged.habitFocus ?? (legacyProfile ? "balanced" : null),
      trackingMode: merged.trackingMode ?? (legacyProfile ? "flexible" : null),
      dailyTarget: merged.dailyTarget ?? (legacyProfile ? "1hour" : null),
      habits: (merged.habits ?? []).map((habit) => ({
        ...habit,
        type: habit.type ?? inferHabitType(habit.category),
      })),
      unlockedAchievements: merged.unlockedAchievements ?? [],
    };
  } catch {
    return initialState;
  }
}

function inferHabitType(category: string): HabitType {
  const value = category.toLocaleLowerCase("ru");
  if (/здоров|восстанов|эргоном|баланс/.test(value)) return "passive";
  if (/рост|портфолио|бренд|маркет|исследован/.test(value)) return "marketing";
  if (/стратег|планирован|команда|управлен|метрик|архитект/.test(value)) return "strategy";
  return "active";
}

function preferredHabitTypes(focus: HabitFocusId, goal: PrimaryGoalId): HabitType[] {
  if (goal === "recovery") return ["passive", "passive", "active", "strategy", "passive", "marketing", "active", "strategy"];
  if (goal === "switch") return ["active", "marketing", "active", "strategy", "passive", "marketing", "active", "strategy"];
  if (goal === "expertise") return ["active", "strategy", "active", "active", "passive", "strategy", "marketing", "active"];
  switch (focus) {
    case "hard_skills": return ["active", "active", "strategy", "passive", "active", "marketing", "active", "strategy"];
    case "wellness": return ["passive", "passive", "active", "marketing", "passive", "strategy", "active", "passive"];
    case "growth": return ["marketing", "strategy", "marketing", "active", "strategy", "passive", "marketing", "strategy"];
    default: return ["active", "passive", "marketing", "strategy", ...habitTypes];
  }
}

const habitCountByTarget: Record<DailyTargetId, number> = {
  "15min": 2,
  "30min": 3,
  "1hour": 5,
  "2hours": 8,
};

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useStore() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const completeOnboarding = useCallback(
    (profile: {
      professionId: ProfessionId;
      experienceLevel: ExperienceLevel;
      primaryGoal: PrimaryGoalId;
      habitFocus: HabitFocusId;
      dailyTarget: DailyTargetId;
      trackingMode: TrackingMode;
    }) => {
      const prof = professionMap[profile.professionId];
      const priority = preferredHabitTypes(profile.habitFocus, profile.primaryGoal);
      setState((s) => {
        const habits = s.onboarded
          ? s.habits
          : priority.slice(0, habitCountByTarget[profile.dailyTarget]).map((type, index) => {
              const candidates = prof.presets.filter((preset) => preset.type === type);
              const preset = candidates.filter((candidate) => !s.habits.some((habit) => habit.title === candidate.title))[index % candidates.length]
                ?? candidates[index % candidates.length];
              return { id: uid(), ...preset, custom: false };
            });
        return { ...s, onboarded: true, ...profile, habits };
      });
    },
    []
  );

  const toggleHabit = useCallback((habitId: string) => {
    const key = todayKey();
    const hour = new Date().getHours();
    setState((s) => {
      const todayDone = s.completedDates[key] ?? [];
      const isDone = todayDone.includes(habitId);
      let completedDates: Record<string, string[]>;
      let xp = s.xp;
      let hadEarlyBird = s.hadEarlyBird;
      let hadPerfectDay = s.hadPerfectDay;
      if (isDone) {
        completedDates = {
          ...s.completedDates,
          [key]: todayDone.filter((id) => id !== habitId),
        };
        xp = Math.max(0, s.xp - XP_PER_HABIT);
      } else {
        completedDates = {
          ...s.completedDates,
          [key]: [...todayDone, habitId],
        };
        xp = s.xp + XP_PER_HABIT;
        if (hour < 9) hadEarlyBird = true;
        if (completedDates[key].length >= s.habits.length && s.habits.length > 0) {
          hadPerfectDay = true;
        }
      }
      // Recompute best streak
      const activeDates = Object.keys(completedDates).filter((date) =>
        isActiveDate(completedDates[date] ?? [], s.habits, s.trackingMode)
      );
      const bestStreak = Math.max(s.bestStreak, computeBestStreak(activeDates));
      return { ...s, completedDates, xp, bestStreak, hadEarlyBird, hadPerfectDay };
    });
  }, []);

  const addHabit = useCallback(
    (data: HabitDraft) => {
      const habit: Habit = { id: uid(), custom: true, ...data };
      setState((s) => ({ ...s, habits: [...s.habits, habit] }));
    },
    []
  );

  const addHabits = useCallback((items: HabitDraft[]) => {
    if (items.length === 0) return;
    const habits = items.map((data) => ({ id: uid(), custom: true, ...data }));
    setState((s) => ({ ...s, habits: [...s.habits, ...habits] }));
  }, []);

  const updateHabit = useCallback((id: string, data: HabitDraft) => {
      setState((s) => ({
        ...s,
        habits: s.habits.map((h) => (h.id === id ? { ...h, ...data } : h)),
      }));
    }, []);

  const deleteHabit = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      habits: s.habits.filter((h) => h.id !== id),
      completedDates: Object.fromEntries(
        Object.entries(s.completedDates).map(([k, v]) => [
          k,
          v.filter((hid) => hid !== id),
        ])
      ),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(initialState);
  }, []);

  const importState = useCallback((imported: Partial<AppState>) => {
    setState(() => ({ ...initialState, ...imported }));
  }, []);

  const rememberAchievements = useCallback((ids: AchievementId[]) => {
    setState((s) => {
      const unlocked = new Set([...s.unlockedAchievements, ...ids]);
      if (unlocked.size === s.unlockedAchievements.length) return s;
      return { ...s, unlockedAchievements: [...unlocked] };
    });
  }, []);

  const activeDates = Object.keys(state.completedDates).filter(
    (date) => isActiveDate(state.completedDates[date] ?? [], state.habits, state.trackingMode)
  );
  const streak = computeStreak(activeDates);
  const todayDone = state.completedDates[todayKey()] ?? [];

  return {
    state,
    streak,
    todayDone,
    completeOnboarding,
    toggleHabit,
    addHabit,
    addHabits,
    updateHabit,
    deleteHabit,
    resetAll,
    importState,
    rememberAchievements,
  };
}

function isActiveDate(completed: string[], habits: Habit[], mode: TrackingMode | null): boolean {
  if (completed.length === 0) return false;
  if (mode !== "strict") return true;
  const todayHabitIds = new Set(habits.map((habit) => habit.id));
  return habits.length > 0 && new Set(completed.filter((id) => todayHabitIds.has(id))).size >= habits.length;
}

export type Store = ReturnType<typeof useStore>;

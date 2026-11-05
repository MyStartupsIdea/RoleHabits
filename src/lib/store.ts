import { useCallback, useEffect, useState } from "react";
import type {
  ProfessionId,
  ExperienceLevel,
  DailyTargetId,
  Difficulty,
  IconName,
} from "../data/professions";
import { professionMap } from "../data/professions";
import { XP_PER_HABIT } from "./gamification";
import { todayKey, computeStreak } from "./dates";

export interface Habit {
  id: string;
  title: string;
  category: string;
  minutes: number;
  difficulty: Difficulty;
  icon: IconName;
  custom: boolean;
}

export interface AppState {
  onboarded: boolean;
  professionId: ProfessionId | null;
  experienceLevel: ExperienceLevel | null;
  dailyTarget: DailyTargetId | null;
  habits: Habit[];
  completedDates: Record<string, string[]>; // dateKey -> habitIds
  xp: number;
}

const STORAGE_KEY = "rolehabits:state:v1";

const initialState: AppState = {
  onboarded: false,
  professionId: null,
  experienceLevel: null,
  dailyTarget: null,
  habits: [],
  completedDates: {},
  xp: 0,
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

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
    (
      professionId: ProfessionId,
      experienceLevel: ExperienceLevel,
      dailyTarget: DailyTargetId
    ) => {
      const prof = professionMap[professionId];
      const habits: Habit[] = prof.presets.map((p) => ({
        id: uid(),
        title: p.title,
        category: p.category,
        minutes: p.minutes,
        difficulty: p.difficulty,
        icon: p.icon,
        custom: false,
      }));
      setState((s) => ({
        ...s,
        onboarded: true,
        professionId,
        experienceLevel,
        dailyTarget,
        habits,
      }));
    },
    []
  );

  const toggleHabit = useCallback((habitId: string) => {
    const key = todayKey();
    setState((s) => {
      const todayDone = s.completedDates[key] ?? [];
      const isDone = todayDone.includes(habitId);
      let completedDates: Record<string, string[]>;
      let xp = s.xp;
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
      }
      return { ...s, completedDates, xp };
    });
  }, []);

  const addHabit = useCallback(
    (data: {
      title: string;
      category: string;
      minutes: number;
      difficulty: Difficulty;
      icon: IconName;
    }) => {
      const habit: Habit = { id: uid(), custom: true, ...data };
      setState((s) => ({ ...s, habits: [...s.habits, habit] }));
    },
    []
  );

  const updateHabit = useCallback(
    (
      id: string,
      data: {
        title: string;
        category: string;
        minutes: number;
        difficulty: Difficulty;
        icon: IconName;
      }
    ) => {
      setState((s) => ({
        ...s,
        habits: s.habits.map((h) => (h.id === id ? { ...h, ...data } : h)),
      }));
    },
    []
  );

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

  const activeDates = Object.keys(state.completedDates).filter(
    (k) => (state.completedDates[k] ?? []).length > 0
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
    updateHabit,
    deleteHabit,
    resetAll,
  };
}

export type Store = ReturnType<typeof useStore>;

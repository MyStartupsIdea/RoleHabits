import { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Plus, CheckCircle2, Sparkles } from "lucide-react";

import { useStore } from "./lib/store";
import { XP_PER_HABIT } from "./lib/gamification";
import { todayKey } from "./lib/dates";
import { professionMap } from "./data/professions";
import type { IconName, Difficulty } from "./data/professions";

import OnboardingWizard from "./components/OnboardingWizard";
import Header from "./components/Header";
import HabitCard from "./components/HabitCard";
import HabitModal from "./components/HabitModal";
import ConfirmDialog from "./components/ConfirmDialog";
import StreakHeatmap from "./components/StreakHeatmap";

export default function App() {
  const store = useStore();
  const { state } = store;

  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<string | null>(null);
  const celebratedRef = useRef<string | null>(null);

  const todayDone = state.completedDates[todayKey()] ?? [];
  const totalHabits = state.habits.length;
  const doneCount = todayDone.length;
  const progress = totalHabits > 0 ? (doneCount / totalHabits) * 100 : 0;
  const allDone = totalHabits > 0 && doneCount === totalHabits;

  // Confetti on 100%
  useEffect(() => {
    if (allDone && celebratedRef.current !== todayKey()) {
      celebratedRef.current = todayKey();
      fireConfetti();
    }
  }, [allDone]);

  // Reset celebration flag when day changes or habits uncompleted
  useEffect(() => {
    if (!allDone) {
      celebratedRef.current = null;
    }
  }, [allDone]);

  if (!state.onboarded) {
    return <OnboardingWizard store={store} />;
  }

  const prof = state.professionId
    ? professionMap[state.professionId]
    : null;
  if (!prof || !state.experienceLevel || !state.dailyTarget) {
    return <OnboardingWizard store={store} />;
  }

  const editingHabitObj = state.habits.find((h) => h.id === editingHabit) ?? null;
  const deletingHabitObj = state.habits.find((h) => h.id === deletingHabit) ?? null;

  const handleHabitSave = (data: {
    title: string;
    category: string;
    minutes: number;
    difficulty: Difficulty;
    icon: IconName;
  }) => {
    if (editingHabit) {
      store.updateHabit(editingHabit, data);
    } else {
      store.addHabit(data);
    }
    setHabitModalOpen(false);
    setEditingHabit(null);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Сбросить все данные и пройти онбординг заново? Это удалит все привычки и прогресс."
      )
    ) {
      store.resetAll();
    }
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <Header
        professionId={prof.id}
        dailyTarget={state.dailyTarget}
        xp={state.xp}
        streak={store.streak}
        onAddHabit={() => {
          setEditingHabit(null);
          setHabitModalOpen(true);
        }}
        onReset={handleReset}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Daily progress */}
        <section>
          <div className="rounded-2xl border border-ink-700 bg-ink-900/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-base">Прогресс за сегодня</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {doneCount} из {totalHabits} привычек · +{doneCount * XP_PER_HABIT} XP
                </p>
              </div>
              <div className="flex items-center gap-2">
                {allDone ? (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                    Готово!
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-gradient">
                    {Math.round(progress)}%
                  </span>
                )}
              </div>
            </div>
            <div className="h-3 rounded-full bg-ink-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  allDone
                    ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Weekly heatmap */}
        <section>
          <div className="rounded-2xl border border-ink-700 bg-ink-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base">Активность за неделю</h2>
              <span className="text-xs text-zinc-500">
                {store.streak} {store.streak === 1 ? "день" : store.streak < 5 ? "дня" : "дней"} подряд
              </span>
            </div>
            <StreakHeatmap
              completedDates={state.completedDates}
              totalHabits={totalHabits}
            />
          </div>
        </section>

        {/* Today's habits */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">Привычки на сегодня</h2>
            <button
              onClick={() => {
                setEditingHabit(null);
                setHabitModalOpen(true);
              }}
              className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          {totalHabits === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-600 bg-ink-900/30 p-10 text-center">
              <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">
                Пока нет привычек. Добавьте свою первую!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence>
                {state.habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    icon={habit.icon}
                    title={habit.title}
                    category={habit.category}
                    minutes={habit.minutes}
                    difficulty={habit.difficulty}
                    done={todayDone.includes(habit.id)}
                    custom={habit.custom}
                    onToggle={() => store.toggleHabit(habit.id)}
                    onEdit={() => {
                      setEditingHabit(habit.id);
                      setHabitModalOpen(true);
                    }}
                    onDelete={() => setDeletingHabit(habit.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Footer hint */}
        <p className="text-center text-xs text-zinc-600 pt-2 pb-4">
          +{XP_PER_HABIT} XP за каждую выполненную привычку
        </p>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {habitModalOpen && (
          <HabitModal
            habit={editingHabitObj}
            onSave={handleHabitSave}
            onClose={() => {
              setHabitModalOpen(false);
              setEditingHabit(null);
            }}
          />
        )}
      </AnimatePresence>

      {deletingHabitObj && (
        <ConfirmDialog
          habitTitle={deletingHabitObj.title}
          onConfirm={() => {
            store.deleteHabit(deletingHabitObj.id);
            setDeletingHabit(null);
          }}
          onCancel={() => setDeletingHabit(null)}
        />
      )}
    </div>
  );
}

function fireConfetti() {
  const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#22d3ee", "#34d399", "#fbbf24"];
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 200);
}

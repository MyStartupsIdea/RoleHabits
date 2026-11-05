import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, Plus, Sparkles } from "lucide-react";
import { useStore } from "./lib/store";
import { getLevelInfo, XP_PER_HABIT, type Level } from "./lib/gamification";
import { todayKey } from "./lib/dates";
import { professionMap } from "./data/professions";
import type { HabitDraft } from "./lib/store";
import { computeAnalytics } from "./lib/analytics";
import { russianCount } from "./lib/format";
import { getUnlockedAchievements, type AchievementId, type AchievementStats } from "./lib/achievements";
import OnboardingWizard from "./components/OnboardingWizard";
import Header from "./components/Header";
import Navigation, { type PageId } from "./components/Navigation";
import HabitCard from "./components/HabitCard";
import HabitModal from "./components/HabitModal";
import ConfirmDialog from "./components/ConfirmDialog";
import StreakHeatmap from "./components/StreakHeatmap";
import CatalogPage from "./components/CatalogPage";
import AnalyticsPage from "./components/AnalyticsPage";
import AchievementsPage from "./components/AchievementsPage";
import SettingsPage from "./components/SettingsPage";
import LevelUpModal from "./components/LevelUpModal";

export default function App() {
  const store = useStore();
  const { state } = store;
  const [page, setPage] = useState<PageId>("today");
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<string | null>(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [levelUp, setLevelUp] = useState<Level | null>(null);
  const celebratedRef = useRef<string | null>(null);
  const previousLevelRef = useRef(getLevelInfo(state.xp).levelIndex);

  const todayDone = state.completedDates[todayKey()] ?? [];
  const totalHabits = state.habits.length;
  const doneCount = todayDone.filter((id) => state.habits.some((habit) => habit.id === id)).length;
  const progress = totalHabits > 0 ? Math.min(100, (doneCount / totalHabits) * 100) : 0;
  const allDone = totalHabits > 0 && doneCount === totalHabits;

  useEffect(() => {
    if (allDone && celebratedRef.current !== todayKey()) {
      celebratedRef.current = todayKey();
      fireConfetti();
    }
    if (!allDone) celebratedRef.current = null;
  }, [allDone]);

  useEffect(() => {
    const currentLevel = getLevelInfo(state.xp);
    if (currentLevel.levelIndex > previousLevelRef.current) {
      setLevelUp(currentLevel.level);
      fireConfetti();
    }
    previousLevelRef.current = currentLevel.levelIndex;
  }, [state.xp]);

  const analytics = useMemo(
    () => computeAnalytics(state.habits, state.completedDates, state.xp),
    [state.habits, state.completedDates, state.xp]
  );
  const achievementStats: AchievementStats = useMemo(() => ({
    totalCompleted: analytics.totalCompleted,
    currentStreak: store.streak,
    bestStreak: state.bestStreak,
    level: getLevelInfo(state.xp).level,
    xp: state.xp,
    customHabitCount: state.habits.filter((habit) => habit.custom).length,
    totalHabitCount: state.habits.length,
    hadEarlyBird: state.hadEarlyBird,
    hadPerfectDay: state.hadPerfectDay,
  }), [analytics, store.streak, state]);
  const earnedAchievements = useMemo(() => getUnlockedAchievements(achievementStats), [achievementStats]);
  const unlockedAchievements = useMemo(
    () => new Set<AchievementId>([...state.unlockedAchievements, ...earnedAchievements]),
    [state.unlockedAchievements, earnedAchievements]
  );
  useEffect(() => store.rememberAchievements([...unlockedAchievements]), [store.rememberAchievements, unlockedAchievements]);

  if (!state.onboarded || !state.professionId || !state.experienceLevel || !state.dailyTarget || !state.primaryGoal || !state.habitFocus || !state.trackingMode) {
    return <OnboardingWizard store={store} />;
  }

  const profession = professionMap[state.professionId];
  const editingHabitObj = state.habits.find((habit) => habit.id === editingHabit) ?? null;
  const deletingHabitObj = state.habits.find((habit) => habit.id === deletingHabit) ?? null;

  const handleHabitSave = (habit: HabitDraft) => {
    if (editingHabit) store.updateHabit(editingHabit, habit);
    else store.addHabit(habit);
    setHabitModalOpen(false);
    setEditingHabit(null);
  };
  const handleSaveManyHabits = (habits: HabitDraft[]) => {
    store.addHabits(habits);
    setHabitModalOpen(false);
    setEditingHabit(null);
  };
  const handleReset = () => {
    if (window.confirm("Сбросить весь профиль, привычки, достижения и историю? Это действие нельзя отменить.")) {
      store.resetAll();
      setPage("today");
    }
  };
  const handleImport = (data: typeof state) => {
    if (window.confirm("Заменить текущие привычки, профиль и историю данными из резервной копии?")) {
      store.importState(data);
      setPage("today");
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 pb-20 lg:pb-0">
      <Header professionId={profession.id} dailyTarget={state.dailyTarget} xp={state.xp} streak={store.streak} onAddHabit={() => { setEditingHabit(null); setHabitModalOpen(true); }} onEditProfile={() => setProfileEditOpen(true)} />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 py-5 sm:py-7">
        <Navigation page={page} onNavigate={setPage} />
        <main className="min-w-0 flex-1">
          <motion.div key={page} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16 }}>
              {page === "today" && <TodayPage state={state} todayDone={todayDone} doneCount={doneCount} totalHabits={totalHabits} progress={progress} streak={store.streak} onAdd={() => { setEditingHabit(null); setHabitModalOpen(true); }} onEdit={(id) => { setEditingHabit(id); setHabitModalOpen(true); }} onDelete={setDeletingHabit} onToggle={store.toggleHabit} />}
              {page === "catalog" && <CatalogPage currentProfession={profession.id} habits={state.habits} onAdd={store.addHabit} />}
              {page === "analytics" && <AnalyticsPage state={state} analytics={analytics} streak={store.streak} />}
              {page === "achievements" && <AchievementsPage xp={state.xp} unlocked={unlockedAchievements} />}
              {page === "settings" && <SettingsPage state={state} onEditProfile={() => setProfileEditOpen(true)} onReset={handleReset} onImport={handleImport} />}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {habitModalOpen && <HabitModal habit={editingHabitObj} professionId={profession.id} onSave={handleHabitSave} onSaveMany={handleSaveManyHabits} onClose={() => { setHabitModalOpen(false); setEditingHabit(null); }} />}
      </AnimatePresence>
      {deletingHabitObj && <ConfirmDialog habitTitle={deletingHabitObj.title} onConfirm={() => { store.deleteHabit(deletingHabitObj.id); setDeletingHabit(null); }} onCancel={() => setDeletingHabit(null)} />}
      <AnimatePresence>
        {profileEditOpen && <OnboardingWizard store={store} initialProfile={state} onCancel={() => setProfileEditOpen(false)} />}
        {levelUp && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
      </AnimatePresence>
    </div>
  );
}

function TodayPage({ state, todayDone, doneCount, totalHabits, progress, streak, onAdd, onEdit, onDelete, onToggle }: {
  state: ReturnType<typeof useStore>["state"];
  todayDone: string[]; doneCount: number; totalHabits: number; progress: number; streak: number;
  onAdd: () => void; onEdit: (id: string) => void; onDelete: (id: string) => void; onToggle: (id: string) => void;
}) {
  const allDone = totalHabits > 0 && doneCount === totalHabits;
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-900 via-ink-900 to-indigo-950/50 p-5 sm:p-7">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4"><div><div className="text-xs uppercase tracking-[0.18em] text-indigo-300/70">{new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}</div><h1 className="mt-2 text-2xl sm:text-3xl font-bold">Ваш рост начинается сегодня</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">Один законченный шаг — уже вклад в профессиональный путь. Выберите привычку и отметьте результат.</p></div><div className="hidden sm:grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-orange-400/20 bg-orange-400/5 text-orange-300"><span className="text-xl font-bold">{streak}</span></div></div>
        <div className="relative mt-6 rounded-2xl border border-ink-700/80 bg-ink-950/45 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3"><div><div className="text-sm font-semibold">Прогресс дня</div><div className="mt-1 text-xs text-zinc-500">{doneCount} из {totalHabits} привычек · +{doneCount * XP_PER_HABIT} XP</div></div><div className="text-2xl font-bold text-gradient">{allDone ? <span className="flex items-center gap-1.5 text-base text-emerald-300"><CheckCircle2 className="w-5 h-5" />Готово!</span> : `${Math.round(progress)}%`}</div></div>
          <div className="h-3 overflow-hidden rounded-full bg-ink-800"><motion.div initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.45 }} className={`h-full rounded-full ${allDone ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-indigo-500 to-violet-500"}`} /></div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/55 p-5">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">Ритм за неделю</h2><p className="mt-1 text-xs text-zinc-500">{streak} {streak === 1 ? "день" : streak > 1 && streak < 5 ? "дня" : "дней"} подряд</p></div><button onClick={onAdd} className="flex items-center gap-1.5 rounded-lg border border-ink-700 px-3 py-2 text-xs font-medium text-indigo-200 hover:border-indigo-500/40"><Plus className="w-3.5 h-3.5" />Новая привычка</button></div>
        <StreakHeatmap completedDates={state.completedDates} totalHabits={totalHabits} />
      </section>

      <section>
          <div className="mb-3 flex items-end justify-between"><div><h2 className="text-lg font-semibold">План на сегодня</h2><p className="mt-1 text-xs text-zinc-500">Отметьте выполненные практики и получите по 50 XP.</p></div><span className="text-xs text-zinc-500">{totalHabits} {russianCount(totalHabits, "привычка", "привычки", "привычек")}</span></div>
        {totalHabits === 0 ? <div className="rounded-2xl border border-dashed border-ink-600 bg-ink-900/30 p-10 text-center"><Sparkles className="mx-auto mb-3 h-8 w-8 text-zinc-600" /><p className="text-sm text-zinc-400">Пока нет привычек. Добавьте первую практику из каталога.</p></div> : <div className="space-y-2.5"><AnimatePresence>{state.habits.map((habit) => <HabitCard key={habit.id} icon={habit.icon} title={habit.title} category={habit.category} minutes={habit.minutes} difficulty={habit.difficulty} type={habit.type} done={todayDone.includes(habit.id)} custom={habit.custom} onToggle={() => onToggle(habit.id)} onEdit={() => onEdit(habit.id)} onDelete={() => onDelete(habit.id)} />)}</AnimatePresence></div>}
      </section>
      <p className="pb-3 text-center text-[11px] text-zinc-600">Гибкий план поддерживает постоянство, даже когда день идёт не по расписанию.</p>
    </div>
  );
}

function fireConfetti() {
  const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#22d3ee", "#34d399", "#fbbf24"];
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors });
  window.setTimeout(() => {
    confetti({ particleCount: 45, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 45, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
  }, 180);
}

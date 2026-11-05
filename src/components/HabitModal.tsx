import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  iconMap,
  difficultyLabels,
  difficultyStyles,
  type IconName,
  type Difficulty,
  type ProfessionId,
  habitTypes,
  habitTypeLabels,
  type HabitType,
} from "../data/professions";
import type { Habit, HabitDraft } from "../lib/store";
import { generateHabits, type GeneratedHabit } from "../lib/aiGenerator";
import { X, Sparkles, Wand2, Plus, Clock } from "lucide-react";

const iconChoices: IconName[] = [
  "Code2",
  "PenTool",
  "BarChart3",
  "Megaphone",
  "FileText",
  "Target",
  "Dumbbell",
  "Coffee",
  "Eye",
  "Users",
  "TrendingUp",
  "GitBranch",
  "Terminal",
  "Smartphone",
  "Palette",
  "LayoutGrid",
  "PenToolIcon",
];

const difficultyChoices: Difficulty[] = ["easy", "medium", "hard"];

const minuteChoices = [5, 10, 15, 20, 25, 30, 45, 60, 90];

interface Props {
  habit: Habit | null; // null = add mode
  professionId: ProfessionId;
  onSave: (data: HabitDraft) => void;
  onSaveMany: (habits: HabitDraft[]) => void;
  onClose: () => void;
}

export default function HabitModal({
  habit,
  professionId,
  onSave,
  onSaveMany,
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [minutes, setMinutes] = useState(15);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [icon, setIcon] = useState<IconName>("Target");
  const [type, setType] = useState<HabitType>("active");

  // AI generator state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiGoal, setAiGoal] = useState("");
  const [aiResults, setAiResults] = useState<GeneratedHabit[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setCategory(habit.category);
      setMinutes(habit.minutes);
      setDifficulty(habit.difficulty);
      setIcon(habit.icon);
      setType(habit.type);
    }
  }, [habit]);

  const canSave = title.trim().length > 0 && category.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      title: title.trim(),
      category: category.trim(),
      minutes,
      difficulty,
      icon,
      type,
    });
  };

  const handleGenerate = () => {
    if (!aiGoal.trim()) return;
    setAiLoading(true);
    setAiResults(null);
    try {
      setAiResults(generateHabits(aiGoal, professionId));
    } finally {
      setAiLoading(false);
    }
  };

  const applyGenerated = (g: GeneratedHabit) => {
    setTitle(g.title);
    setCategory(g.category);
    setMinutes(g.minutes);
    setDifficulty(g.difficulty);
    setIcon(g.icon);
    setType(g.type);
    setAiOpen(false);
    setAiResults(null);
    setAiGoal("");
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700 shrink-0">
            <h2 className="font-bold text-lg">
              {habit ? "Редактировать привычку" : "Новая привычка"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto scrollbar-thin px-6 py-5 flex-1 space-y-4">
            {/* AI Generator toggle */}
            {!habit && (
              <div>
                <button
                  type="button"
                  onClick={() => setAiOpen((v) => !v)}
                  className="w-full flex items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/5 px-4 py-3 text-left hover:bg-violet-500/10 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                    <Wand2 className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-violet-300">
                      Сгенерировать с помощью ИИ
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      Локальный подбор по цели — 3 готовые привычки без внешнего сервиса
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </button>

                <AnimatePresence>
                  {aiOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aiGoal}
                            onChange={(e) => setAiGoal(e.target.value)}
                            placeholder="Например: Хочу стать ведущим разработчиком"
                            className="flex-1 rounded-xl border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-sm placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleGenerate();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={!aiGoal.trim() || aiLoading}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-400 hover:to-fuchsia-400 transition-all shrink-0"
                          >
                            {aiLoading ? "..." : "Генерировать"}
                          </button>
                        </div>

                        {/* Loading shimmer */}
                        {aiLoading && (
                          <div className="space-y-2">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="h-14 rounded-xl bg-ink-800 border border-ink-700 overflow-hidden relative"
                              >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-500/10 to-transparent animate-shimmer" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Results */}
                        {aiResults && !aiLoading && (
                          <div className="space-y-2">
                            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                              Подобрано привычек: {aiResults.length}
                            </div>
                            {aiResults.map((g, i) => {
                              const GIcon = iconMap[g.icon];
                              return (
                                <motion.button
                                  key={i}
                                  type="button"
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.08 }}
                                  onClick={() => applyGenerated(g)}
                                  className="w-full flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-800/50 p-3 text-left hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                                >
                                  <div className="w-9 h-9 rounded-lg bg-ink-700 group-hover:bg-violet-500/15 flex items-center justify-center shrink-0 transition-colors">
                                    <GIcon className="w-4.5 h-4.5 text-zinc-300 group-hover:text-violet-300" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-zinc-100">
                                      {g.title}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[11px] text-zinc-500">
                                        {g.category}
                                      </span>
                                      <span className="text-[11px] text-indigo-300">
                                        {habitTypeLabels[g.type]}
                                      </span>
                                      <span className="text-[11px] text-zinc-600">·</span>
                                      <span className="text-[11px] text-zinc-500 flex items-center gap-0.5">
                                        <Clock className="w-3 h-3" />
                                        {g.minutes} мин
                                      </span>
                                      <span
                                        className={`text-[11px] px-1.5 py-0.5 rounded-full border ${difficultyStyles[g.difficulty]}`}
                                      >
                                        {difficultyLabels[g.difficulty]}
                                      </span>
                                    </div>
                                  </div>
                                  <Plus className="w-4 h-4 text-zinc-600 group-hover:text-violet-300 shrink-0 transition-colors" />
                                </motion.button>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => onSaveMany(aiResults)}
                              className="w-full rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 hover:bg-violet-500/20 transition-colors"
                            >
                              Добавить все {aiResults.length} привычки
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Divider when AI panel is open */}
            {!habit && aiOpen && (
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-ink-700" />
                <span className="text-[11px] text-zinc-600">или вручную</span>
                <div className="flex-1 h-px bg-ink-700" />
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
                Название
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Изучение TypeScript"
                className="w-full rounded-xl border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-sm placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                autoFocus
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
                Категория
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Например: Обучение"
                className="w-full rounded-xl border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-sm placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 block">
                Тип развития
              </label>
              <div className="grid grid-cols-2 gap-2">
                {habitTypes.map((habitType) => (
                  <button
                    key={habitType}
                    type="button"
                    onClick={() => setType(habitType)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${type === habitType ? "border-indigo-500 bg-indigo-500/10 text-indigo-200" : "border-ink-700 bg-ink-800/50 text-zinc-400 hover:border-ink-600"}`}
                  >
                    {habitTypeLabels[habitType]}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
                Время выполнения
              </label>
              <div className="flex flex-wrap gap-2">
                {minuteChoices.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinutes(m)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      minutes === m
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                        : "border-ink-700 bg-ink-800/50 text-zinc-400 hover:border-ink-600"
                    }`}
                  >
                    {m} мин
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
                Сложность
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficultyChoices.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      difficulty === d
                        ? d === "easy"
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                          : d === "medium"
                            ? "border-amber-500 bg-amber-500/10 text-amber-300"
                            : "border-rose-500 bg-rose-500/10 text-rose-300"
                        : "border-ink-700 bg-ink-800/50 text-zinc-400 hover:border-ink-600"
                    }`}
                  >
                    {difficultyLabels[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
                Иконка
              </label>
              <div className="grid grid-cols-8 sm:grid-cols-9 gap-2">
                {iconChoices.map((name) => {
                  const Icon = iconMap[name];
                  const selected = icon === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setIcon(name)}
                      className={`aspect-square rounded-lg flex items-center justify-center border transition-all ${
                        selected
                          ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                          : "border-ink-700 bg-ink-800/50 text-zinc-400 hover:border-ink-600 hover:text-zinc-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-ink-700 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-400 hover:to-violet-400 transition-all shadow-lg shadow-indigo-500/20"
            >
              {habit ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

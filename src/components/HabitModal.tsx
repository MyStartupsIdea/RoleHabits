import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  iconMap,
  difficultyLabels,
  type IconName,
  type Difficulty,
} from "../data/professions";
import type { Habit } from "../lib/store";
import { X } from "lucide-react";

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
  onSave: (data: {
    title: string;
    category: string;
    minutes: number;
    difficulty: Difficulty;
    icon: IconName;
  }) => void;
  onClose: () => void;
}

export default function HabitModal({ habit, onSave, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [minutes, setMinutes] = useState(15);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [icon, setIcon] = useState<IconName>("Target");

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setCategory(habit.category);
      setMinutes(habit.minutes);
      setDifficulty(habit.difficulty);
      setIcon(habit.icon);
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
    });
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
        className="w-full max-w-lg rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700">
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

          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
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

          <div className="px-6 py-4 border-t border-ink-700 flex justify-end gap-3">
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

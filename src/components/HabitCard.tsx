import { motion } from "framer-motion";
import { Clock, Pencil, Trash2 } from "lucide-react";
import {
  iconMap,
  difficultyLabels,
  difficultyStyles,
  type Difficulty,
  habitTypeShortLabels,
  type HabitType,
} from "../data/professions";

interface Props {
  icon: keyof typeof iconMap;
  title: string;
  category: string;
  minutes: number;
  difficulty: Difficulty;
  type: HabitType;
  done: boolean;
  custom: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const difficultyDot: Record<Difficulty, string> = {
  easy: "bg-emerald-400",
  medium: "bg-amber-400",
  hard: "bg-rose-400",
};

export default function HabitCard({
  icon,
  title,
  category,
  minutes,
  difficulty,
  type,
  done,
  custom,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex items-center gap-3.5 rounded-xl border p-4 transition-colors ${
        done
          ? "border-indigo-500/30 bg-indigo-500/5"
          : "border-ink-700 bg-ink-800/40 hover:border-ink-600 hover:bg-ink-800/70"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="shrink-0 focus:outline-none"
        aria-label={done ? "Снять отметку" : "Отметить выполненным"}
      >
        <motion.div
          whileTap={{ scale: 0.85 }}
          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors ${
            done
              ? "bg-gradient-to-br from-indigo-500 to-violet-500 border-transparent"
              : "border-ink-600 hover:border-indigo-500"
          }`}
        >
          <AnimateCheck done={done} />
        </motion.div>
      </button>

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
          done
            ? "bg-indigo-500/15 text-indigo-300"
            : "bg-ink-700 text-zinc-300 group-hover:bg-ink-600"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={`font-medium text-sm transition-all ${
            done ? "text-zinc-500 line-through" : "text-zinc-100"
          }`}
        >
          {title}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[11px] text-zinc-500">{category}</span>
          <span className="rounded-full bg-ink-700 px-1.5 py-0.5 text-[10px] text-indigo-200">{habitTypeShortLabels[type]}</span>
          <span className="text-[11px] text-zinc-600">·</span>
          <span className="text-[11px] text-zinc-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {minutes} мин
          </span>
          {custom && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-600 text-zinc-400 font-medium">
              Своя
            </span>
          )}
        </div>
      </div>

      {/* Difficulty badge */}
      <span
        className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border ${difficultyStyles[difficulty]} shrink-0`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${difficultyDot[difficulty]}`} />
        {difficultyLabels[difficulty]}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
          aria-label="Редактировать"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          aria-label="Удалить"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function AnimateCheck({ done }: { done: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <motion.path
        d="M5 13l4 4L19 7"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </svg>
  );
}

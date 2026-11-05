import { motion } from "framer-motion";
import {
  X,
  CheckCircle2,
  TrendingUp,
  Flame,
  Target,
  Zap,
  Award,
  Calendar,
} from "lucide-react";
import type { AnalyticsData } from "../lib/analytics";
import { levelLabels } from "../lib/gamification";

interface Props {
  data: AnalyticsData;
  onClose: () => void;
}

const categoryColors = [
  "from-indigo-500 to-violet-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-fuchsia-500 to-purple-500",
];

export default function StatsModal({ data, onClose }: Props) {
  const cards = [
    {
      icon: CheckCircle2,
      label: "Выполнено всего",
      value: data.totalCompleted,
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: TrendingUp,
      label: "Успешность",
      value: `${data.successRate}%`,
      color: "from-indigo-500 to-violet-500",
    },
    {
      icon: Flame,
      label: "Лучшая серия",
      value: `${data.bestStreak} дн.`,
      color: "from-orange-500 to-rose-500",
    },
    {
      icon: Target,
      label: "Текущая серия",
      value: `${data.currentStreak} дн.`,
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: Zap,
      label: "Всего XP",
      value: data.xp,
      color: "from-yellow-400 to-amber-500",
    },
    {
      icon: Calendar,
      label: "Активных дней",
      value: data.totalDaysActive,
      color: "from-cyan-500 to-blue-500",
    },
  ];

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
        className="w-full max-w-2xl rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700 shrink-0">
          <div>
            <h2 className="font-bold text-lg">Статистика</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Уровень: {levelLabels[data.level]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-thin px-6 py-5 flex-1 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-ink-700 bg-ink-800/40 p-4"
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-2.5`}
                  >
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="text-xl font-bold">{card.value}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {card.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Category breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">
              Привычки по категориям
            </h3>
            {data.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-zinc-600">Нет данных</p>
            ) : (
              <div className="space-y-2.5">
                {data.categoryBreakdown.map((cat, i) => {
                  const colorIdx = i % categoryColors.length;
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-zinc-300">
                          {cat.category}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {cat.count} · {cat.percentage}%
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-ink-700 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${categoryColors[colorIdx]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary badge */}
          <div className="flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-zinc-400">
              {data.totalCompleted >= 50
                ? "Выполнив "
                : "Вы выполнили "}
              <span className="font-bold text-zinc-200">
                {data.totalCompleted}
              </span>{" "}
              привычек и накопили{" "}
              <span className="font-bold text-indigo-300">{data.xp} XP</span>.
              {data.bestStreak > 0 && (
                <>
                  {" "}
                  Лучшая серия —{" "}
                  <span className="font-bold text-orange-300">
                    {data.bestStreak} дней
                  </span>
                  .
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

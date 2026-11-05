import { motion } from "framer-motion";
import { X, Lock, Check } from "lucide-react";
import {
  achievements,
  getUnlockedAchievements,
  type AchievementStats,
  type AchievementId,
} from "../lib/achievements";

interface Props {
  stats: AchievementStats;
  unlocked: ReadonlySet<AchievementId>;
  onClose: () => void;
}

export default function AchievementsModal({ stats, unlocked, onClose }: Props) {
  const computedUnlocked = getUnlockedAchievements(stats);
  const visibleUnlocked = new Set([...unlocked, ...computedUnlocked]);
  const unlockedCount = visibleUnlocked.size;
  const totalCount = achievements.length;

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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700 shrink-0">
          <div>
            <h2 className="font-bold text-lg">Достижения</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Открыто {unlockedCount} из {totalCount}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4 shrink-0">
          <div className="h-2 rounded-full bg-ink-700 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto scrollbar-thin px-6 py-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach, i) => {
              const isUnlocked = visibleUnlocked.has(ach.id);
              const Icon = ach.icon;
              return (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`relative flex items-center gap-3.5 rounded-xl border p-4 transition-colors ${
                    isUnlocked
                      ? "border-ink-600 bg-ink-800/60"
                      : "border-ink-700/60 bg-ink-800/20"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? `bg-gradient-to-br ${ach.color} shadow-lg`
                        : "bg-ink-700/60"
                    }`}
                  >
                    {isUnlocked ? (
                      <Icon className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-zinc-600" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-semibold text-sm ${
                        isUnlocked ? "text-zinc-100" : "text-zinc-500"
                      }`}
                    >
                      {ach.title}
                    </div>
                    <div
                      className={`text-xs mt-0.5 leading-snug ${
                        isUnlocked ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {ach.description}
                    </div>
                  </div>

                  {/* Check */}
                  {isUnlocked && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

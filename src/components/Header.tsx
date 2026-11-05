import { Flame, Plus, Zap, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import {
  professionMap,
  dailyTargetMap,
  iconMap,
  type ProfessionId,
  type DailyTargetId,
} from "../data/professions";
import { getLevelInfo, levelLabels } from "../lib/gamification";

interface Props {
  professionId: ProfessionId;
  dailyTarget: DailyTargetId;
  xp: number;
  streak: number;
  onAddHabit: () => void;
  onReset: () => void;
}

export default function Header({
  professionId,
  dailyTarget,
  xp,
  streak,
  onAddHabit,
  onReset,
}: Props) {
  const prof = professionMap[professionId];
  const levelInfo = getLevelInfo(xp);
  const levelLabel = levelLabels[levelInfo.level];
  const ProfIcon = iconMap[prof.icon];
  const target = dailyTargetMap[dailyTarget];

  return (
    <header className="border-b border-ink-700 bg-ink-900/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">RoleHabits</span>
          </div>

          {/* Profile summary */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-700">
              <Flame className="w-4 h-4 text-orange-400" fill="currentColor" />
              <span className="font-bold text-sm">{streak}</span>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">дней</span>
            </div>

            {/* Add habit button */}
            <button
              onClick={onAddHabit}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold hover:from-indigo-400 hover:to-violet-400 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Привычка</span>
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-ink-800 transition-colors"
              title="Сбросить все данные"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile bar */}
        <div className="flex items-center gap-3 sm:gap-4 mt-3.5 pt-3.5 border-t border-ink-700/60">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${prof.gradient} flex items-center justify-center shrink-0 shadow-lg`}
          >
            <ProfIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{prof.label}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-300 font-semibold">
                {levelLabel} {prof.shortLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-2 rounded-full bg-ink-700 overflow-hidden max-w-[200px]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-[11px] text-zinc-500 shrink-0">
                {levelInfo.totalXp} XP
                {levelInfo.levelIndex < 3 && (
                  <span className="text-zinc-600"> / {(levelInfo.levelIndex + 1) * 1000}</span>
                )}
              </span>
            </div>
          </div>

          {/* XP and target stats */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Zap className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                <span className="font-bold text-sm">{xp}</span>
              </div>
              <div className="text-[11px] text-zinc-500">XP всего</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm">{target.label}</div>
              <div className="text-[11px] text-zinc-500">цель в день</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

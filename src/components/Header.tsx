import { motion } from "framer-motion";
import { Flame, Pencil, Plus, Zap } from "lucide-react";
import { dailyTargetMap, iconMap, professionMap, type DailyTargetId, type ProfessionId } from "../data/professions";
import { getLevelInfo, levelLabels } from "../lib/gamification";

interface Props {
  professionId: ProfessionId;
  dailyTarget: DailyTargetId;
  xp: number;
  streak: number;
  onAddHabit: () => void;
  onEditProfile: () => void;
}

export default function Header({ professionId, dailyTarget, xp, streak, onAddHabit, onEditProfile }: Props) {
  const profession = professionMap[professionId];
  const Icon = iconMap[profession.icon];
  const level = getLevelInfo(xp);

  return (
    <header className="sticky top-0 z-20 border-b border-ink-700 bg-ink-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20"><span className="text-white font-bold">R</span></div>
          <span className="hidden sm:block font-bold text-lg">RoleHabits</span>
        </div>
        <div className="h-8 w-px bg-ink-700 hidden sm:block" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${profession.gradient} flex items-center justify-center shrink-0`}><Icon className="w-4.5 h-4.5 text-white" /></div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{profession.label}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500"><span>{levelLabels[level.level]}</span><span>·</span><span>{dailyTargetMap[dailyTarget].label} в день</span></div>
          </div>
          <button onClick={onEditProfile} title="Настроить профиль" aria-label="Настроить профиль" className="ml-1 rounded-lg p-1.5 text-zinc-500 hover:bg-ink-800 hover:text-indigo-300"><Pencil className="w-3.5 h-3.5" /></button>
        </div>
        <div className="hidden md:flex items-center gap-2.5 min-w-36">
          <div className="flex-1 h-2 rounded-full bg-ink-700 overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" initial={false} animate={{ width: `${level.progress}%` }} transition={{ duration: 0.45 }} /></div>
          <span className="flex items-center gap-1 text-xs font-semibold text-zinc-300"><Zap className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />{xp}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-orange-500/15 bg-orange-500/5 px-2.5 py-2 text-sm font-bold text-orange-200" title="Серия дней">
          <motion.div animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }} transition={{ duration: 1.7, repeat: Infinity }}><Flame className="w-4 h-4 text-orange-400" fill="currentColor" /></motion.div>{streak}<span className="hidden sm:inline text-[11px] font-medium text-orange-200/60">дн.</span>
        </div>
        <button onClick={onAddHabit} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/15 transition hover:from-indigo-400 hover:to-violet-400">
          <Plus className="w-4 h-4" /><span className="hidden sm:inline">Привычка</span>
        </button>
      </div>
    </header>
  );
}

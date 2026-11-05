import { motion } from "framer-motion";
import { Check, Lock, Trophy } from "lucide-react";
import { achievements, type AchievementId } from "../lib/achievements";
import { getLevelInfo, levelLabels, levelOrder } from "../lib/gamification";

interface Props { xp: number; unlocked: ReadonlySet<AchievementId>; }

export default function AchievementsPage({ xp, unlocked }: Props) {
  const level = getLevelInfo(xp);
  const nextLabel = levelOrder[Math.min(level.levelIndex + 1, levelOrder.length - 1)];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><div className="text-xs uppercase tracking-[0.18em] text-amber-300/70 mb-2">Ваш путь мастерства</div><h1 className="text-2xl sm:text-3xl font-bold">Достижения</h1><p className="text-sm text-zinc-500 mt-1">Каждый выполненный шаг добавляет опыт и открывает новые знаки.</p></div>
      <section className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-ink-900 to-violet-500/10 p-5 sm:p-6">
        <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/20"><Trophy className="w-8 h-8 text-white" /></div>
          <div className="flex-1"><div className="text-xs uppercase tracking-wider text-indigo-200/70">Текущий уровень</div><div className="mt-1 flex items-center gap-2"><h2 className="text-2xl font-bold">{levelLabels[level.level]}</h2><span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-200">{xp} XP</span></div>
            <div className="mt-3 h-2.5 max-w-xl overflow-hidden rounded-full bg-ink-800"><motion.div initial={{ width: 0 }} animate={{ width: `${level.progress}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" /></div>
            <p className="mt-2 text-xs text-zinc-500">{level.levelIndex === 3 ? "Достигнут максимальный уровень" : `${level.xpForNextLevel - level.xpInLevel} XP до уровня «${levelLabels[nextLabel]}»`}</p>
          </div>
          <div className="sm:text-right"><div className="text-3xl font-bold text-amber-200">{unlocked.size}<span className="text-lg text-zinc-600">/{achievements.length}</span></div><div className="text-xs text-zinc-500">открыто достижений</div></div>
        </div>
        <div className="relative mt-6 grid grid-cols-4 gap-2">
          {levelOrder.map((item, index) => <div key={item} className={`rounded-xl border p-2.5 text-center ${index <= level.levelIndex ? "border-indigo-400/30 bg-indigo-400/10" : "border-ink-700 bg-ink-950/30"}`}><div className={`text-[10px] sm:text-xs font-semibold ${index <= level.levelIndex ? "text-indigo-200" : "text-zinc-600"}`}>{levelLabels[item]}</div><div className="mt-1 text-[9px] text-zinc-600">{index * 1000} XP</div></div>)}
        </div>
      </section>
      <section>
        <div className="flex items-end justify-between mb-3"><div><h2 className="font-semibold">Коллекция знаков</h2><p className="text-xs text-zinc-500 mt-1">Новые знаки открываются автоматически по мере роста.</p></div></div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {achievements.map((achievement, index) => {
            const isUnlocked = unlocked.has(achievement.id);
            const Icon = achievement.icon;
            return <motion.article key={achievement.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }} className={`flex items-center gap-3 rounded-2xl border p-4 ${isUnlocked ? "border-ink-600 bg-ink-900/70" : "border-ink-800 bg-ink-900/30 opacity-70"}`}>
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${isUnlocked ? `bg-gradient-to-br ${achievement.color}` : "bg-ink-800"}`}>{isUnlocked ? <Icon className="w-6 h-6 text-white" /> : <Lock className="w-5 h-5 text-zinc-600" />}</div>
              <div className="min-w-0 flex-1"><h3 className={`text-sm font-semibold ${isUnlocked ? "text-zinc-100" : "text-zinc-500"}`}>{achievement.title}</h3><p className="mt-1 text-xs leading-relaxed text-zinc-500">{achievement.description}</p></div>
              {isUnlocked && <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
            </motion.article>;
          })}
        </div>
      </section>
    </motion.div>
  );
}

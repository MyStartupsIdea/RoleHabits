import { motion } from "framer-motion";
import { Sparkles, Trophy, X } from "lucide-react";
import { levelLabels, type Level } from "../lib/gamification";

export default function LevelUpModal({ level, onClose }: { level: Level; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-amber-400/20 bg-ink-900 p-7 text-center shadow-2xl shadow-amber-500/10" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} aria-label="Закрыть" className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-500 hover:bg-ink-800 hover:text-zinc-200"><X className="w-4 h-4" /></button>
        <motion.div initial={{ rotate: -12, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 14 }} className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-amber-300 via-orange-400 to-violet-500 shadow-xl shadow-orange-500/20"><Trophy className="w-10 h-10 text-white" /></motion.div>
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.18em] text-amber-200"><Sparkles className="w-3.5 h-3.5" />Новый уровень</div>
        <h2 className="mt-2 text-2xl font-bold">{levelLabels[level]}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">Ваша регулярная практика приносит результат. Продолжайте укреплять профессиональную экспертизу.</p>
        <button onClick={onClose} className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white hover:from-indigo-400 hover:to-violet-400">Продолжить</button>
      </motion.div>
    </div>
  );
}

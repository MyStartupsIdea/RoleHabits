import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Plus,
  Zap,
  RotateCcw,
  Award,
  BarChart3,
  Settings,
  Download,
  Upload,
  X,
} from "lucide-react";
import {
  professionMap,
  dailyTargetMap,
  iconMap,
  type ProfessionId,
  type DailyTargetId,
} from "../data/professions";
import { getLevelInfo, levelLabels } from "../lib/gamification";
import type { AppState } from "../lib/store";
import { exportData, parseImportedFile } from "../lib/dataIO";

interface Props {
  professionId: ProfessionId;
  dailyTarget: DailyTargetId;
  xp: number;
  streak: number;
  unlockedAchievements: number;
  state: AppState;
  onAddHabit: () => void;
  onReset: () => void;
  onAchievements: () => void;
  onStats: () => void;
  onImport: (data: Partial<AppState>) => void;
}

export default function Header({
  professionId,
  dailyTarget,
  xp,
  streak,
  unlockedAchievements,
  state,
  onAddHabit,
  onReset,
  onAchievements,
  onStats,
  onImport,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prof = professionMap[professionId];
  const levelInfo = getLevelInfo(xp);
  const levelLabel = levelLabels[levelInfo.level];
  const ProfIcon = iconMap[prof.icon];
  const target = dailyTargetMap[dailyTarget];

  const handleExport = () => {
    exportData(state);
    setMenuOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsed = parseImportedFile(text);
      if (parsed) {
        onImport(parsed);
        setMenuOpen(false);
      } else {
        setImportError("Не удалось прочитать файл. Проверьте формат.");
      }
    };
    reader.onerror = () => setImportError("Ошибка чтения файла.");
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="border-b border-ink-700 bg-ink-900/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">RoleHabits</span>
          </div>

          {/* Profile summary */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-700">
              <Flame className="w-4 h-4 text-orange-400" fill="currentColor" />
              <span className="font-bold text-sm">{streak}</span>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">дней</span>
            </div>

            {/* Achievements */}
            <button
              onClick={onAchievements}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-700 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all"
              title="Достижения"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm hidden sm:inline">
                {unlockedAchievements}
              </span>
            </button>

            {/* Stats */}
            <button
              onClick={onStats}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-ink-800 border border-ink-700 text-zinc-400 hover:text-indigo-300 hover:border-indigo-500/40 transition-all"
              title="Статистика"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            {/* Add habit button */}
            <button
              onClick={onAddHabit}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold hover:from-indigo-400 hover:to-violet-400 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Привычка</span>
            </button>

            {/* Settings menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-ink-800 transition-colors border border-transparent hover:border-ink-700"
                title="Настройки"
              >
                <Settings className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden z-40"
                    >
                      <div className="p-1.5">
                        <button
                          onClick={handleExport}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-ink-800 transition-colors"
                        >
                          <Download className="w-4 h-4 text-zinc-400" />
                          Экспорт данных
                        </button>
                        <button
                          onClick={handleImportClick}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-ink-800 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-zinc-400" />
                          Импорт данных
                        </button>
                        <div className="h-px bg-ink-700 my-1.5" />
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onReset();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-300 hover:bg-rose-500/10 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Сбросить всё
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
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

      {/* Import error toast */}
      <AnimatePresence>
        {importError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto px-4 sm:px-6"
          >
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 mt-2">
              <X className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="text-sm text-rose-300">{importError}</span>
              <button
                onClick={() => setImportError(null)}
                className="ml-auto text-rose-400 hover:text-rose-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

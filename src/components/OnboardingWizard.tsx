import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  professions,
  experienceLevels,
  dailyTargets,
  professionMap,
  iconMap,
  difficultyLabels,
  difficultyStyles,
  type ProfessionId,
  type ExperienceLevel,
  type DailyTargetId,
} from "../data/professions";
import type { Store } from "../lib/store";

interface Props {
  store: Store;
}

export default function OnboardingWizard({ store }: Props) {
  const [step, setStep] = useState(0);
  const [professionId, setProfessionId] = useState<ProfessionId | null>(null);
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);
  const [dailyTarget, setDailyTarget] = useState<DailyTargetId | null>(null);

  const canProceed =
    (step === 0 && professionId !== null) ||
    (step === 1 && experienceLevel !== null && dailyTarget !== null) ||
    step === 2;

  const handleFinish = () => {
    if (professionId && experienceLevel && dailyTarget) {
      store.completeOnboarding(professionId, experienceLevel, dailyTarget);
    }
  };

  const prof = professionId ? professionMap[professionId] : null;

  const steps = ["Профессия", "Уровень", "Привычки"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-2xl rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with step progress */}
        <div className="px-6 pt-6 pb-4 border-b border-ink-700 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-lg">RoleHabits</span>
            </div>
            <span className="text-xs text-zinc-500">
              Шаг {step + 1} из {steps.length}
            </span>
          </div>
          <div className="flex gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors duration-300 ${
                    i <= step ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-ink-700"
                  }`}
                />
                <span
                  className={`text-[11px] mt-1.5 block transition-colors ${
                    i <= step ? "text-zinc-300" : "text-zinc-600"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto scrollbar-thin px-6 py-6 flex-1">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-bold mb-1">Выберите вашу профессию</h2>
                <p className="text-sm text-zinc-400 mb-5">
                  Мы подберём привычки под вашу специализацию
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {professions.map((p) => {
                    const Icon = iconMap[p.icon];
                    const selected = professionId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setProfessionId(p.id)}
                        className={`group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                          selected
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-ink-700 bg-ink-800/50 hover:border-ink-600 hover:bg-ink-800"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm">{p.label}</div>
                          <div className="text-xs text-zinc-500 mt-0.5 leading-snug">
                            {p.description}
                          </div>
                        </div>
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"
                          >
                            <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                              <path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z" />
                            </svg>
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-bold mb-1">Ваш уровень и цель</h2>
                <p className="text-sm text-zinc-400 mb-5">
                  Опишите опыт и сколько времени готовы тратить ежедневно
                </p>

                <div className="mb-5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 block">
                    Уровень опыта
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {experienceLevels.map((lvl) => {
                      const selected = experienceLevel === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          onClick={() => setExperienceLevel(lvl.id)}
                          className={`rounded-xl border p-3 text-center transition-all ${
                            selected
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-ink-700 bg-ink-800/50 hover:border-ink-600"
                          }`}
                        >
                          <div className="font-bold text-sm">{lvl.label}</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
                            {lvl.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 block">
                    Дневная цель
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dailyTargets.map((t) => {
                      const selected = dailyTarget === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setDailyTarget(t.id)}
                          className={`rounded-xl border p-3 text-center transition-all ${
                            selected
                              ? "border-violet-500 bg-violet-500/10"
                              : "border-ink-700 bg-ink-800/50 hover:border-ink-600"
                          }`}
                        >
                          <div className="font-bold text-sm">{t.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && prof && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-bold mb-1">Ваши привычки на каждый день</h2>
                <p className="text-sm text-zinc-400 mb-5">
                  Предустановленные привычки для профессии «{prof.label}». Вы сможете
                  добавлять свои позже.
                </p>
                <div className="space-y-2.5">
                  {prof.presets.map((preset, i) => {
                    const Icon = iconMap[preset.icon];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-800/50 p-3.5"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${prof.gradient} flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{preset.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-zinc-500">
                              {preset.category}
                            </span>
                            <span className="text-[11px] text-zinc-600">·</span>
                            <span className="text-[11px] text-zinc-500">
                              {preset.minutes} мин
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full border ${difficultyStyles[preset.difficulty]}`}
                        >
                          {difficultyLabels[preset.difficulty]}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-ink-700 flex items-center justify-between shrink-0">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Назад
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-400 hover:to-violet-400 transition-all shadow-lg shadow-indigo-500/20"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400 transition-all shadow-lg shadow-indigo-500/20"
            >
              Начать
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

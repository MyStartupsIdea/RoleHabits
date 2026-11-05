import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileCheck2, RotateCcw, ShieldCheck, Upload, UserRound, X } from "lucide-react";
import { dailyTargetMap, experienceLevels, habitFocuses, primaryGoals, professionMap, trackingModes } from "../data/professions";
import type { AppState } from "../lib/store";
import { exportData, parseImportedFile } from "../lib/dataIO";

interface Props { state: AppState; onEditProfile: () => void; onReset: () => void; onImport: (data: AppState) => void; }

export default function SettingsPage({ state, onEditProfile, onReset, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const changeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseImportedFile(String(reader.result ?? ""));
      if (!parsed) setMessage({ text: "Файл не распознан. Выберите резервную копию RoleHabits в формате JSON.", error: true });
      else { onImport(parsed); setMessage({ text: "Резервная копия проверена. Подтвердите замену текущих данных." }); }
    };
    reader.onerror = () => setMessage({ text: "Не удалось прочитать файл.", error: true });
    reader.readAsText(file);
    event.target.value = "";
  };
  const profession = state.professionId ? professionMap[state.professionId] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><div className="text-xs uppercase tracking-[0.18em] text-indigo-300/70 mb-2">Ваше пространство</div><h1 className="text-2xl sm:text-3xl font-bold">Настройки</h1><p className="text-sm text-zinc-500 mt-1">Управляйте профилем, данными и правилами развития.</p></div>
      <section className="rounded-2xl border border-ink-700 bg-ink-900/60 p-5 sm:p-6">
        <div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500"><UserRound className="w-5 h-5 text-white" /></div><div className="flex-1"><h2 className="font-semibold">Профиль развития</h2><p className="mt-1 text-xs text-zinc-500">Эти настройки формируют ваш план на ближайшие три месяца.</p></div><button onClick={onEditProfile} className="rounded-xl border border-ink-600 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-200">Изменить</button></div>
        <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <ProfileValue label="Профессиональная область" value={profession?.label ?? "Не выбрана"} />
          <ProfileValue label="Уровень опыта" value={experienceLevels.find((item) => item.id === state.experienceLevel)?.label ?? "Не выбран"} />
          <ProfileValue label="Цель на 3 месяца" value={primaryGoals.find((item) => item.id === state.primaryGoal)?.label ?? "Не выбрана"} />
          <ProfileValue label="Основной фокус" value={habitFocuses.find((item) => item.id === state.habitFocus)?.label ?? "Не выбран"} />
          <ProfileValue label="Время в день" value={state.dailyTarget ? dailyTargetMap[state.dailyTarget].label : "Не выбрано"} />
          <ProfileValue label="Отслеживание" value={trackingModes.find((item) => item.id === state.trackingMode)?.label ?? "Не выбрано"} />
        </div>
      </section>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/60 p-5 sm:p-6">
        <div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500"><ShieldCheck className="w-5 h-5 text-white" /></div><div><h2 className="font-semibold">Резервная копия</h2><p className="mt-1 text-xs text-zinc-500">Сохраните привычки, историю, достижения и настройки профиля в JSON-файл.</p></div></div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button onClick={() => exportData(state)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-400 hover:to-violet-400"><Download className="w-4 h-4" />Экспорт данных</button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-xl border border-ink-600 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:border-indigo-500/40"><Upload className="w-4 h-4" />Импорт данных</button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={changeFile} className="hidden" />
        </div>
        <AnimatePresence>{message && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mt-4 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs ${message.error ? "border-rose-500/20 bg-rose-500/5 text-rose-200" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-200"}`}><FileCheck2 className="w-4 h-4 shrink-0" /><span>{message.text}</span><button className="ml-auto" onClick={() => setMessage(null)} aria-label="Закрыть"><X className="w-3.5 h-3.5" /></button></motion.div>}</AnimatePresence>
      </section>

      <section className="rounded-2xl border border-rose-500/15 bg-rose-500/[0.025] p-5 sm:p-6">
        <div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-500/10"><RotateCcw className="w-5 h-5 text-rose-300" /></div><div className="flex-1"><h2 className="font-semibold">Сбросить прогресс</h2><p className="mt-1 text-xs text-zinc-500">Удалит привычки, историю, опыт и профиль с этого устройства. Перед сбросом можно скачать резервную копию.</p></div><button onClick={onReset} className="rounded-xl border border-rose-500/25 px-3 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/10">Сбросить всё</button></div>
      </section>
    </motion.div>
  );
}

function ProfileValue({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-ink-700 bg-ink-950/40 p-3"><div className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</div><div className="mt-1.5 text-sm font-medium text-zinc-200">{value}</div></div>;
}

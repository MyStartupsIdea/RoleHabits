import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Plus, Search, Sparkles } from "lucide-react";
import { difficultyLabels, difficultyStyles, habitTypeLabels, habitTypes, iconMap, professions, professionMap, type HabitType, type ProfessionId } from "../data/professions";
import type { Habit, HabitDraft } from "../lib/store";
import { russianCount } from "../lib/format";

interface Props { currentProfession: ProfessionId; habits: Habit[]; onAdd: (habit: HabitDraft) => void; }

export default function CatalogPage({ currentProfession, habits, onAdd }: Props) {
  const [professionId, setProfessionId] = useState<ProfessionId>(currentProfession);
  const [selectedType, setSelectedType] = useState<HabitType | "all">("all");
  const [query, setQuery] = useState("");
  const [addedTitle, setAddedTitle] = useState<string | null>(null);
  const profession = professionMap[professionId];
  const filtered = useMemo(() => profession.presets.filter((item) =>
    (selectedType === "all" || item.type === selectedType) &&
    `${item.title} ${item.category}`.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru"))
  ), [profession, selectedType, query]);

  const add = (item: typeof profession.presets[number]) => {
    onAdd(item);
    setAddedTitle(item.title);
    window.setTimeout(() => setAddedTitle((current) => current === item.title ? null : current), 1400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><div className="text-xs uppercase tracking-[0.18em] text-indigo-300/70 mb-2">Библиотека практик</div><h1 className="text-2xl sm:text-3xl font-bold">Каталог привычек</h1><p className="text-sm text-zinc-500 mt-1">72 практики для шести профессиональных направлений.</p></div>
        <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Найти привычку…" className="w-full rounded-xl border border-ink-700 bg-ink-900/70 pl-9 pr-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500" /></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {professions.map((item) => {
          const Icon = iconMap[item.icon];
          return <button key={item.id} onClick={() => setProfessionId(item.id)} className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${professionId === item.id ? "border-indigo-500/50 bg-indigo-500/10" : "border-ink-700 bg-ink-900/50 hover:border-ink-600"}`}>
            <span className={`grid w-8 h-8 place-items-center rounded-lg bg-gradient-to-br ${item.gradient}`}><Icon className="w-4 h-4 text-white" /></span><span className="text-xs sm:text-sm font-medium text-zinc-200">{item.label}</span>
          </button>;
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <TypeTab selected={selectedType === "all"} onClick={() => setSelectedType("all")}>Все типы</TypeTab>
        {habitTypes.map((type) => <TypeTab key={type} selected={selectedType === type} onClick={() => setSelectedType(type)}>{habitTypeLabels[type]}</TypeTab>)}
      </div>

      <div className="flex items-center gap-3">
        <div className={`grid w-10 h-10 place-items-center rounded-xl bg-gradient-to-br ${profession.gradient}`}><Sparkles className="w-5 h-5 text-white" /></div>
        <div><h2 className="font-semibold">{profession.label}</h2><p className="text-xs text-zinc-500">{habitTypeLabels[selectedType === "all" ? "active" : selectedType]}{selectedType === "all" ? " и другие направления" : ""}</p></div>
        <span className="ml-auto text-xs text-zinc-500">{filtered.length} {russianCount(filtered.length, "практика", "практики", "практик")}</span>
      </div>

      {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-ink-600 bg-ink-900/30 p-10 text-center text-sm text-zinc-500">Ничего не найдено. Измените запрос или тип практики.</div> :
        <div className="grid md:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const Icon = iconMap[item.icon];
              const exists = habits.some((habit) => habit.title === item.title);
              const justAdded = addedTitle === item.title;
              return <motion.article layout key={`${professionId}-${item.title}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="group rounded-2xl border border-ink-700 bg-ink-900/60 p-4 transition-colors hover:border-ink-600">
                <div className="flex items-start gap-3">
                  <div className="grid w-10 h-10 shrink-0 place-items-center rounded-xl bg-ink-800 text-indigo-300 group-hover:bg-indigo-500/10"><Icon className="w-5 h-5" /></div>
                  <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3><div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500"><span>{item.category}</span><span>·</span><span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{item.minutes} мин</span></div></div>
                  <button onClick={() => add(item)} disabled={exists} className={`grid w-8 h-8 place-items-center rounded-lg border transition ${exists ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-ink-700 text-zinc-400 hover:border-indigo-500/40 hover:text-indigo-200"}`} aria-label={exists ? "Уже в вашем плане" : "Добавить привычку"} title={exists ? "Уже в вашем плане" : "Добавить в план"}>{exists || justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}</button>
                </div>
                <div className="mt-3 flex items-center gap-2"><span className="rounded-full border border-indigo-500/20 bg-indigo-500/5 px-2 py-1 text-[10px] text-indigo-200">{habitTypeLabels[item.type]}</span><span className={`rounded-full border px-2 py-1 text-[10px] ${difficultyStyles[item.difficulty]}`}>{difficultyLabels[item.difficulty]}</span><span className="ml-auto text-[10px] text-zinc-600">+50 XP</span></div>
              </motion.article>;
            })}
          </AnimatePresence>
        </div>}
    </motion.div>
  );
}

function TypeTab({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${selected ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200" : "border-ink-700 bg-ink-900/40 text-zinc-400 hover:text-zinc-200"}`}>{children}</button>;
}

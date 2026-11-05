import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Award, CalendarDays, CheckCircle2, Flame, TrendingUp, Zap } from "lucide-react";
import type { AnalyticsData } from "../lib/analytics";
import type { AppState } from "../lib/store";
import { dayLabel, formatDateKey, todayKey } from "../lib/dates";
import { russianCount } from "../lib/format";

interface Props { state: AppState; analytics: AnalyticsData; streak: number; }
type Range = "week" | "month";

const colors = ["from-indigo-500 to-violet-500", "from-cyan-500 to-blue-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500", "from-fuchsia-500 to-pink-500"];

export default function AnalyticsPage({ state, analytics, streak }: Props) {
  const [range, setRange] = useState<Range>("week");
  const days = useMemo(() => {
    const count = range === "week" ? 7 : 30;
    return Array.from({ length: count }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (count - index - 1));
      const key = formatDateKey(date);
      const done = new Set(state.completedDates[key] ?? []).size;
      return { key, done, rate: state.habits.length ? Math.min(100, Math.round((done / state.habits.length) * 100)) : 0 };
    });
  }, [range, state.completedDates, state.habits.length]);
  const periodTotal = days.reduce((sum, day) => sum + day.done, 0);
  const averageRate = days.length ? Math.round(days.reduce((sum, day) => sum + day.rate, 0) / days.length) : 0;
  const today = todayKey();
  const cards = [
    { label: "Выполнено всего", value: analytics.totalCompleted, icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
    { label: "Успешность сегодня", value: `${analytics.successRate}%`, icon: TrendingUp, color: "from-indigo-500 to-violet-500" },
    { label: "Лучшая серия", value: `${analytics.bestStreak} дн.`, icon: Flame, color: "from-orange-500 to-rose-500" },
    { label: "Опыт", value: `${analytics.xp} XP`, icon: Zap, color: "from-amber-400 to-yellow-500" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><div className="text-xs uppercase tracking-[0.18em] text-indigo-300/70 mb-2">Ваш прогресс</div><h1 className="text-2xl sm:text-3xl font-bold">Аналитика</h1><p className="text-sm text-zinc-500 mt-1">Последовательность важнее идеального дня.</p></div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map(({ label, value, icon: Icon, color }, index) => <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-ink-700 bg-ink-900/60 p-4">
          <div className={`grid w-9 h-9 place-items-center rounded-xl bg-gradient-to-br ${color} mb-3`}><Icon className="w-4 h-4 text-white" /></div><div className="text-xl font-bold">{value}</div><div className="text-[11px] text-zinc-500 mt-1">{label}</div>
        </motion.div>)}
      </div>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/60 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div><h2 className="font-semibold">История активности</h2><p className="text-xs text-zinc-500 mt-1">{range === "week" ? "Последние 7 дней" : "Последние 30 дней"} · {periodTotal} {russianCount(periodTotal, "выполнение", "выполнения", "выполнений")}</p></div>
          <div className="flex rounded-xl border border-ink-700 bg-ink-950/60 p-1">
            <RangeButton selected={range === "week"} onClick={() => setRange("week")}>Неделя</RangeButton><RangeButton selected={range === "month"} onClick={() => setRange("month")}>Месяц</RangeButton>
          </div>
        </div>
        <div className="overflow-x-auto">
        <div className={`grid items-end gap-1.5 sm:gap-2 h-44 ${range === "week" ? "grid-cols-7" : "min-w-[720px] grid-cols-[repeat(30,minmax(0,1fr))]"}`}>
          {days.map((day) => {
            const height = day.done ? Math.max(10, day.rate) : 3;
            const label = range === "week" ? dayLabel(day.key) : day.key.slice(-2);
            return <div key={day.key} className="flex h-full flex-col items-center justify-end gap-2 group" title={`${day.key}: ${day.done} привычек, ${day.rate}%`}>
              <div className="flex h-full w-full items-end"><motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.4 }} className={`w-full rounded-t-md ${day.key === today ? "bg-gradient-to-t from-violet-600 to-indigo-400" : day.done ? "bg-gradient-to-t from-indigo-700 to-violet-400" : "bg-ink-800"}`} /></div>
              <span className={`text-[9px] sm:text-[10px] ${day.key === today ? "text-indigo-300" : "text-zinc-600"}`}>{label}</span>
            </div>;
          })}
        </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-800 pt-4 text-xs text-zinc-500"><span>В среднем за день: <b className="text-zinc-300">{averageRate}%</b></span><span>Активных дней: <b className="text-zinc-300">{days.filter((day) => day.done > 0).length}</b></span><span>Серия сейчас: <b className="text-orange-300">{streak} дн.</b></span></div>
      </section>

      <div className="grid xl:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-ink-700 bg-ink-900/60 p-5">
          <div className="flex items-center gap-2 mb-4"><CalendarDays className="w-4 h-4 text-indigo-300" /><h2 className="font-semibold">Карта привычек</h2></div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day) => <div key={day.key} title={`${day.key}: ${day.done} выполнено`} className={`aspect-square rounded-md border ${day.done === 0 ? "border-ink-700 bg-ink-800/50" : day.rate >= 100 ? "border-transparent bg-gradient-to-br from-indigo-500 to-violet-500" : day.rate >= 50 ? "border-indigo-500/30 bg-indigo-500/50" : "border-indigo-500/20 bg-indigo-500/20"}`} />)}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-zinc-600"><span>{days[0]?.key}</span><span>{today}</span></div>
        </section>

        <section className="rounded-2xl border border-ink-700 bg-ink-900/60 p-5">
          <div className="flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-violet-300" /><h2 className="font-semibold">Состав плана</h2></div>
          {analytics.categoryBreakdown.length === 0 ? <p className="text-sm text-zinc-500">Добавьте привычки, чтобы увидеть распределение.</p> : <div className="space-y-3">
            {analytics.categoryBreakdown.map((item, index) => <div key={item.category}>
              <div className="mb-1.5 flex justify-between text-xs"><span className="text-zinc-300">{item.category}</span><span className="text-zinc-500">{item.count} · {item.percentage}%</span></div><div className="h-2 overflow-hidden rounded-full bg-ink-800"><motion.div initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} transition={{ duration: 0.5 }} className={`h-full rounded-full bg-gradient-to-r ${colors[index % colors.length]}`} /></div>
            </div>)}
          </div>}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-3"><Award className="w-5 h-5 text-amber-300" /><p className="text-xs text-zinc-400">Выполнено <b className="text-zinc-200">{analytics.totalCompleted}</b> привычек и накоплено <b className="text-amber-200">{analytics.xp} XP</b>.</p></div>
        </section>
      </div>
    </motion.div>
  );
}

function RangeButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${selected ? "bg-ink-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-200"}`}>{children}</button>;
}

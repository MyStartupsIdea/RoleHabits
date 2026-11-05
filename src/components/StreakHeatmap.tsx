import { getPast7DayKeys, dayLabel, isToday } from "../lib/dates";

interface Props {
  completedDates: Record<string, string[]>;
  totalHabits: number;
}

export default function StreakHeatmap({ completedDates, totalHabits }: Props) {
  const days = getPast7DayKeys();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {days.map((key) => {
        const done = (completedDates[key] ?? []).length;
        const ratio = totalHabits > 0 ? done / totalHabits : 0;
        const today = isToday(key);

        let bg = "bg-ink-800 border-ink-700";
        if (done > 0) {
          if (ratio >= 1) bg = "bg-gradient-to-br from-indigo-500 to-violet-500 border-transparent";
          else if (ratio >= 0.6) bg = "bg-indigo-500/60 border-indigo-500/40";
          else if (ratio >= 0.3) bg = "bg-indigo-500/35 border-indigo-500/25";
          else bg = "bg-indigo-500/20 border-indigo-500/15";
        }

        return (
          <div key={key} className="flex flex-col items-center gap-1.5 flex-1">
            <span
              className={`text-[11px] font-medium ${
                today ? "text-indigo-300" : "text-zinc-500"
              }`}
            >
              {dayLabel(key)}
            </span>
            <div
              className={`w-full aspect-square max-w-[40px] rounded-lg border ${bg} flex items-center justify-center transition-colors`}
              title={`${done} из ${totalHabits} привычек`}
            >
              {done > 0 && (
                <span
                  className={`text-xs font-bold ${
                    ratio >= 1 ? "text-white" : "text-indigo-200"
                  }`}
                >
                  {done}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

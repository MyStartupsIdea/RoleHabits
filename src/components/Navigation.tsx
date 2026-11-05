import { Activity, Award, BookOpen, CalendarCheck2, Settings } from "lucide-react";

export type PageId = "today" | "catalog" | "analytics" | "achievements" | "settings";

const items: { id: PageId; label: string; icon: typeof Activity }[] = [
  { id: "today", label: "Сегодня", icon: CalendarCheck2 },
  { id: "catalog", label: "Каталог", icon: BookOpen },
  { id: "analytics", label: "Аналитика", icon: Activity },
  { id: "achievements", label: "Достижения", icon: Award },
  { id: "settings", label: "Настройки", icon: Settings },
];

export default function Navigation({ page, onNavigate }: { page: PageId; onNavigate: (page: PageId) => void }) {
  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0">
        <nav className="sticky top-28 rounded-2xl border border-ink-700 bg-ink-900/60 p-2 space-y-1" aria-label="Основная навигация">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => onNavigate(id)} aria-current={page === id ? "page" : undefined}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${page === id ? "bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-200 border border-indigo-500/20" : "border border-transparent text-zinc-400 hover:bg-ink-800 hover:text-zinc-200"}`}>
              <Icon className={`w-4.5 h-4.5 ${page === id ? "text-indigo-300" : "text-zinc-500"}`} />{label}
            </button>
          ))}
          <div className="mt-3 rounded-xl border border-ink-700 bg-ink-950/50 p-3">
            <div className="text-[11px] uppercase tracking-wider text-zinc-600">Ритм развития</div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">Небольшая практика каждый день превращается в устойчивый рост.</p>
          </div>
        </nav>
      </aside>
      <nav className="lg:hidden fixed z-30 bottom-0 inset-x-0 border-t border-ink-700 bg-ink-950/95 backdrop-blur-xl px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2" aria-label="Основная навигация">
        <div className="max-w-xl mx-auto grid grid-cols-5 gap-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => onNavigate(id)} aria-current={page === id ? "page" : undefined}
              className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] transition-colors ${page === id ? "text-indigo-300" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Icon className="w-5 h-5" />{label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

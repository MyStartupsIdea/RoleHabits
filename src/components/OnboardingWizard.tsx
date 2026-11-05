import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  dailyTargets,
  experienceLevels,
  habitFocuses,
  habitTypeLabels,
  iconMap,
  primaryGoals,
  professionMap,
  professions,
  trackingModes,
  type DailyTargetId,
  type ExperienceLevel,
  type HabitFocusId,
  type PrimaryGoalId,
  type ProfessionId,
  type TrackingMode,
} from "../data/professions";
import type { Store } from "../lib/store";
import { russianCount } from "../lib/format";

export interface ProfileDraft {
  professionId: ProfessionId | null;
  experienceLevel: ExperienceLevel | null;
  primaryGoal: PrimaryGoalId | null;
  habitFocus: HabitFocusId | null;
  dailyTarget: DailyTargetId | null;
  trackingMode: TrackingMode | null;
}

interface Props {
  store: Store;
  initialProfile?: ProfileDraft;
  onCancel?: () => void;
}

const stepLabels = ["Профессия", "Уровень", "Цель", "Фокус", "Время", "Режим"];

export default function OnboardingWizard({ store, initialProfile, onCancel }: Props) {
  const existing = initialProfile ?? store.state;
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ProfileDraft>({
    professionId: existing.professionId,
    experienceLevel: existing.experienceLevel,
    primaryGoal: existing.primaryGoal,
    habitFocus: existing.habitFocus,
    dailyTarget: existing.dailyTarget,
    trackingMode: existing.trackingMode,
  });

  const set = <K extends keyof ProfileDraft>(key: K, value: NonNullable<ProfileDraft[K]>) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };
  const stepKeys: (keyof ProfileDraft)[] = [
    "professionId", "experienceLevel", "primaryGoal", "habitFocus", "dailyTarget", "trackingMode",
  ];
  const canProceed = profile[stepKeys[step]] !== null;
  const profession = profile.professionId ? professionMap[profile.professionId] : null;
  const previewPresets = profession?.presets.filter((habit) => {
    if (profile.habitFocus === "hard_skills") return habit.type === "active" || habit.type === "strategy";
    if (profile.habitFocus === "wellness") return habit.type === "passive" || habit.type === "active";
    if (profile.habitFocus === "growth") return habit.type === "marketing" || habit.type === "strategy";
    return true;
  }).slice(0, 5) ?? [];

  const complete = () => {
    if (
      profile.professionId && profile.experienceLevel && profile.primaryGoal &&
      profile.habitFocus && profile.dailyTarget && profile.trackingMode
    ) {
      store.completeOnboarding({
        professionId: profile.professionId,
        experienceLevel: profile.experienceLevel,
        primaryGoal: profile.primaryGoal,
        habitFocus: profile.habitFocus,
        dailyTarget: profile.dailyTarget,
        trackingMode: profile.trackingMode,
      });
      onCancel?.();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 backdrop-blur-sm p-4 ${onCancel ? "z-[60]" : ""}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-3xl rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="px-6 pt-6 pb-4 border-b border-ink-700 shrink-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <div>
                <div className="font-bold">RoleHabits</div>
                <div className="text-xs text-zinc-500">Персональная карта развития на 3 месяца</div>
              </div>
            </div>
            <span className="text-xs font-medium text-zinc-400">Шаг {step + 1} из 6</span>
          </div>
          <div className="flex gap-1.5">
            {stepLabels.map((label, index) => (
              <div key={label} className="flex-1 min-w-0">
                <div className={`h-1.5 rounded-full transition-colors ${index <= step ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-ink-700"}`} />
                <span className={`hidden sm:block text-[10px] mt-1.5 truncate ${index <= step ? "text-zinc-300" : "text-zinc-600"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto scrollbar-thin px-6 py-6 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.18 }}
            >
              {step === 0 && <>
                <StepHeading title="В какой области вы развиваетесь?" description="Подберём практики под вашу профессию." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {professions.map((item) => {
                    const Icon = iconMap[item.icon];
                    return <Choice key={item.id} selected={profile.professionId === item.id} onClick={() => set("professionId", item.id)} icon={<Icon className="w-5 h-5 text-white" />} color={item.gradient} title={item.label} description={item.description} />;
                  })}
                </div>
              </>}
              {step === 1 && <>
                <StepHeading title="Ваш уровень опыта" description="Выберите текущую точку, а не идеальную цель." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {experienceLevels.map((item) => <Choice key={item.id} selected={profile.experienceLevel === item.id} onClick={() => set("experienceLevel", item.id)} title={item.label} description={item.description} />)}
                </div>
              </>}
              {step === 2 && <>
                <StepHeading title="Главная цель на ближайшие 3 месяца" description="Это поможет расставить приоритеты в плане." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {primaryGoals.map((item) => <Choice key={item.id} selected={profile.primaryGoal === item.id} onClick={() => set("primaryGoal", item.id)} title={item.label} description={item.description} />)}
                </div>
              </>}
              {step === 3 && <>
                <StepHeading title="На чём сделать основной фокус?" description="В плане останется место и для остальных областей." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {habitFocuses.map((item) => <Choice key={item.id} selected={profile.habitFocus === item.id} onClick={() => set("habitFocus", item.id)} title={item.label} description={item.description} />)}
                </div>
              </>}
              {step === 4 && <>
                <StepHeading title="Сколько времени выделять в день?" description="Можно изменить свой план позже." />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dailyTargets.map((item) => <Choice key={item.id} selected={profile.dailyTarget === item.id} onClick={() => set("dailyTarget", item.id)} title={item.label} description={item.minutes <= 30 ? "Короткий ежедневный ритм" : "Время для глубокой практики"} compact />)}
                </div>
              </>}
              {step === 5 && <>
                <StepHeading title="Как отслеживать прогресс?" description="Выберите правила серии дней." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {trackingModes.map((item) => <Choice key={item.id} selected={profile.trackingMode === item.id} onClick={() => set("trackingMode", item.id)} title={item.label} description={item.description} />)}
                </div>
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-200 mb-3"><Sparkles className="w-4 h-4" />Ваш стартовый план</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profession && <Chip>{profession.label}</Chip>}
                    {profile.experienceLevel && <Chip>{experienceLevels.find((item) => item.id === profile.experienceLevel)?.label}</Chip>}
                    {profile.primaryGoal && <Chip>{primaryGoals.find((item) => item.id === profile.primaryGoal)?.label}</Chip>}
                    {profile.dailyTarget && <Chip>{dailyTargets.find((item) => item.id === profile.dailyTarget)?.label} в день</Chip>}
                  </div>
                  <div className="text-xs text-zinc-400 mb-2">Примеры подходящих привычек:</div>
                  <ul className="space-y-1.5">
                    {previewPresets.map((item) => <li key={item.title} className="flex items-center gap-2 text-xs text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-violet-400" />{item.title}<span className="ml-auto text-zinc-500">{habitTypeLabels[item.type]}</span></li>)}
                  </ul>
                  <div className="text-[11px] text-zinc-500 mt-3">В плане будет {profile.dailyTarget ? ({ "15min": 2, "30min": 3, "1hour": 5, "2hours": 8 }[profile.dailyTarget]) : 0} {russianCount(profile.dailyTarget ? ({ "15min": 2, "30min": 3, "1hour": 5, "2hours": 8 }[profile.dailyTarget]) : 0, "привычка", "привычки", "привычек")}. Их можно менять в каталоге.</div>
                </div>
              </>}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-6 py-4 border-t border-ink-700 flex items-center justify-between shrink-0">
          <button onClick={() => step > 0 ? setStep((current) => current - 1) : onCancel?.()} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <ChevronLeft className="w-4 h-4" />{step === 0 && onCancel ? "Отмена" : "Назад"}
          </button>
          {step < 5 ? (
            <button onClick={() => setStep((current) => current + 1)} disabled={!canProceed} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-400 hover:to-violet-400 transition-all shadow-lg shadow-indigo-500/20">
              Далее<ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={complete} disabled={!canProceed} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-400 hover:to-violet-400 transition-all shadow-lg shadow-indigo-500/20">
              <Check className="w-4 h-4" />{onCancel ? "Сохранить профиль" : "Начать развитие"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StepHeading({ title, description }: { title: string; description: string }) {
  return <div className="mb-5"><h2 className="text-xl font-bold mb-1">{title}</h2><p className="text-sm text-zinc-400">{description}</p></div>;
}

function Choice({ selected, onClick, title, description, icon, color, compact }: {
  selected: boolean; onClick: () => void; title: string; description: string;
  icon?: React.ReactNode; color?: string; compact?: boolean;
}) {
  return (
    <button onClick={onClick} className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${selected ? "border-indigo-500 bg-indigo-500/10" : "border-ink-700 bg-ink-800/50 hover:border-ink-600 hover:bg-ink-800"}`}>
      {icon && <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color ?? "from-indigo-500 to-violet-500"} flex items-center justify-center shrink-0`}>{icon}</div>}
      <div className={compact ? "text-center w-full" : "min-w-0"}>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-zinc-500 mt-1 leading-snug">{description}</div>
      </div>
      {selected && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></motion.span>}
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-1 text-[11px] text-indigo-200">{children}</span>;
}

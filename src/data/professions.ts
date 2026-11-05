import type { LucideIcon } from "lucide-react";
import {
  Code2,
  PenTool,
  BarChart3,
  Megaphone,
  FileText,
  Target,
  Dumbbell,
  Coffee,
  Eye,
  Users,
  TrendingUp,
  GitBranch,
  Terminal,
  Smartphone,
  Palette,
  LayoutGrid,
  PenToolIcon,
} from "lucide-react";

export type IconName =
  | "Code2"
  | "PenTool"
  | "BarChart3"
  | "Megaphone"
  | "FileText"
  | "Target"
  | "Dumbbell"
  | "Coffee"
  | "Eye"
  | "Users"
  | "TrendingUp"
  | "GitBranch"
  | "Terminal"
  | "Smartphone"
  | "Palette"
  | "LayoutGrid"
  | "PenToolIcon";

export const iconMap: Record<IconName, LucideIcon> = {
  Code2,
  PenTool,
  BarChart3,
  Megaphone,
  FileText,
  Target,
  Dumbbell,
  Coffee,
  Eye,
  Users,
  TrendingUp,
  GitBranch,
  Terminal,
  Smartphone,
  Palette,
  LayoutGrid,
  PenToolIcon,
};

export type Difficulty = "easy" | "medium" | "hard";

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Лёгкая",
  medium: "Средняя",
  hard: "Сложная",
};

export const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  hard: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export interface HabitPreset {
  title: string;
  category: string;
  minutes: number;
  difficulty: Difficulty;
  icon: IconName;
}

export type ProfessionId =
  | "frontend"
  | "uxui"
  | "data"
  | "marketing"
  | "content"
  | "pm";

export interface Profession {
  id: ProfessionId;
  label: string;
  shortLabel: string;
  icon: IconName;
  description: string;
  gradient: string;
  presets: HabitPreset[];
}

export const professions: Profession[] = [
  {
    id: "frontend",
    label: "Frontend Разработчик",
    shortLabel: "Frontend",
    icon: "Code2",
    description: "Создаёте интерфейсы и работаете с веб-технологиями",
    gradient: "from-indigo-500 to-violet-500",
    presets: [
      { title: "Практика алгоритмов 30 мин", category: "Алгоритмы", minutes: 30, difficulty: "medium", icon: "Terminal" },
      { title: "Чтение документации React/Vue", category: "Обучение", minutes: 20, difficulty: "easy", icon: "FileText" },
      { title: "Code review пул-реквеста", category: "Качество", minutes: 15, difficulty: "medium", icon: "GitBranch" },
      { title: "Адаптивная вёрстка компонента", category: "Практика", minutes: 45, difficulty: "hard", icon: "Smartphone" },
      { title: "Гимнастика для глаз", category: "Здоровье", minutes: 5, difficulty: "easy", icon: "Eye" },
    ],
  },
  {
    id: "uxui",
    label: "UI/UX Дизайнер",
    shortLabel: "UI/UX",
    icon: "PenTool",
    description: "Проектируете пользовательский опыт и интерфейсы",
    gradient: "from-fuchsia-500 to-pink-500",
    presets: [
      { title: "Анализ UI одного приложения", category: "Исследование", minutes: 20, difficulty: "medium", icon: "Smartphone" },
      { title: "Чтение 1 статьи NNGroup", category: "Обучение", minutes: 15, difficulty: "easy", icon: "FileText" },
      { title: "Скetch макета экрана", category: "Практика", minutes: 40, difficulty: "hard", icon: "Palette" },
      { title: "Изучение дизайн-системы", category: "Обучение", minutes: 25, difficulty: "medium", icon: "LayoutGrid" },
      { title: "Гимнастика для глаз", category: "Здоровье", minutes: 5, difficulty: "easy", icon: "Eye" },
    ],
  },
  {
    id: "data",
    label: "Data Analyst",
    shortLabel: "Data",
    icon: "BarChart3",
    description: "Работаете с данными и строите аналитические выводы",
    gradient: "from-cyan-500 to-blue-500",
    presets: [
      { title: "Практика SQL-запросов", category: "Практика", minutes: 30, difficulty: "medium", icon: "Terminal" },
      { title: "Изучение алгоритма ML", category: "Обучение", minutes: 25, difficulty: "hard", icon: "TrendingUp" },
      { title: "Визуализация датасета", category: "Практика", minutes: 40, difficulty: "hard", icon: "BarChart3" },
      { title: "Чтение статьи по аналитике", category: "Обучение", minutes: 15, difficulty: "easy", icon: "FileText" },
      { title: "Разбор Kaggle-ноутбука", category: "Обучение", minutes: 20, difficulty: "medium", icon: "FileText" },
    ],
  },
  {
    id: "marketing",
    label: "Маркетолог",
    shortLabel: "Marketing",
    icon: "Megaphone",
    description: "Развиваете бренд и привлекаете аудиторию",
    gradient: "from-orange-500 to-amber-500",
    presets: [
      { title: "Анализ конкурентов 15 мин", category: "Исследование", minutes: 15, difficulty: "easy", icon: "Users" },
      { title: "Чтение кейса по маркетингу", category: "Обучение", minutes: 15, difficulty: "easy", icon: "FileText" },
      { title: "Создание контент-плана на неделю", category: "Стратегия", minutes: 30, difficulty: "medium", icon: "Target" },
      { title: "Анализ метрик кампании", category: "Аналитика", minutes: 20, difficulty: "medium", icon: "TrendingUp" },
      { title: "Изучение тренда в соцсетях", category: "Исследование", minutes: 10, difficulty: "easy", icon: "Megaphone" },
    ],
  },
  {
    id: "content",
    label: "Контент-мейкер",
    shortLabel: "Content",
    icon: "FileText",
    description: "Создаёте контент и рассказываете истории",
    gradient: "from-rose-500 to-orange-500",
    presets: [
      { title: "Написание черновика статьи", category: "Создание", minutes: 45, difficulty: "hard", icon: "PenToolIcon" },
      { title: "Монтаж короткого видео", category: "Создание", minutes: 30, difficulty: "medium", icon: "Smartphone" },
      { title: "Чтение книги по сторителлингу", category: "Обучение", minutes: 20, difficulty: "easy", icon: "FileText" },
      { title: "Анализ успешного поста", category: "Исследование", minutes: 15, difficulty: "easy", icon: "TrendingUp" },
      { title: "Планирование контент-серии", category: "Стратегия", minutes: 25, difficulty: "medium", icon: "Target" },
    ],
  },
  {
    id: "pm",
    label: "Product Manager",
    shortLabel: "Product",
    icon: "Target",
    description: "Управляете продуктом и координируете команду",
    gradient: "from-emerald-500 to-teal-500",
    presets: [
      { title: "Обновление бэклога продукта", category: "Планирование", minutes: 20, difficulty: "medium", icon: "LayoutGrid" },
      { title: "Анализ пользовательских отзывов", category: "Исследование", minutes: 25, difficulty: "medium", icon: "Users" },
      { title: "Изучение продуктового кейса", category: "Обучение", minutes: 15, difficulty: "easy", icon: "FileText" },
      { title: "Проверка метрик продукта", category: "Аналитика", minutes: 15, difficulty: "easy", icon: "TrendingUp" },
      { title: "Синхронизация с командой", category: "Команда", minutes: 30, difficulty: "medium", icon: "Users" },
    ],
  },
];

export const professionMap: Record<ProfessionId, Profession> = Object.fromEntries(
  professions.map((p) => [p.id, p])
) as Record<ProfessionId, Profession>;

export type ExperienceLevel = "junior" | "middle" | "senior";

export const experienceLevels: {
  id: ExperienceLevel;
  label: string;
  description: string;
}[] = [
  { id: "junior", label: "Junior", description: "Начинающий специалист" },
  { id: "middle", label: "Middle", description: "Уверенный специалист" },
  { id: "senior", label: "Senior", description: "Опытный эксперт" },
];

export type DailyTargetId = "15min" | "30min" | "1hour";

export const dailyTargets: {
  id: DailyTargetId;
  label: string;
  minutes: number;
}[] = [
  { id: "15min", label: "15 мин", minutes: 15 },
  { id: "30min", label: "30 мин", minutes: 30 },
  { id: "1hour", label: "1 час+", minutes: 60 },
];

export const dailyTargetMap = Object.fromEntries(
  dailyTargets.map((t) => [t.id, { label: t.label, minutes: t.minutes }])
) as Record<DailyTargetId, { label: string; minutes: number }>;

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
  | "Code2" | "PenTool" | "BarChart3" | "Megaphone" | "FileText"
  | "Target" | "Dumbbell" | "Coffee" | "Eye" | "Users" | "TrendingUp"
  | "GitBranch" | "Terminal" | "Smartphone" | "Palette" | "LayoutGrid"
  | "PenToolIcon";

export const iconMap: Record<IconName, LucideIcon> = {
  Code2, PenTool, BarChart3, Megaphone, FileText, Target, Dumbbell, Coffee,
  Eye, Users, TrendingUp, GitBranch, Terminal, Smartphone, Palette, LayoutGrid,
  PenToolIcon,
};

export type Difficulty = "easy" | "medium" | "hard";
export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Лёгкая", medium: "Средняя", hard: "Сложная",
};
export const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  hard: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export type HabitType = "active" | "passive" | "marketing" | "strategy";
export const habitTypeLabels: Record<HabitType, string> = {
  active: "Активные навыки",
  passive: "Здоровье и восстановление",
  marketing: "Маркетинг и рост",
  strategy: "Управление и стратегия",
};
export const habitTypeShortLabels: Record<HabitType, string> = {
  active: "Активные", passive: "Восстановление", marketing: "Рост", strategy: "Стратегия",
};
export const habitTypes: HabitType[] = ["active", "passive", "marketing", "strategy"];

export interface HabitPreset {
  title: string;
  category: string;
  minutes: number;
  difficulty: Difficulty;
  icon: IconName;
  type: HabitType;
}

export type ProfessionId = "frontend" | "uxui" | "data" | "marketing" | "content" | "pm";
export interface Profession {
  id: ProfessionId;
  label: string;
  shortLabel: string;
  icon: IconName;
  description: string;
  gradient: string;
  presets: HabitPreset[];
}

type HabitInput = [string, string, number, Difficulty, IconName];
function group(type: HabitType, items: HabitInput[]): HabitPreset[] {
  return items.map(([title, category, minutes, difficulty, icon]) => ({
    title, category, minutes, difficulty, icon, type,
  }));
}
function profession(
  id: ProfessionId,
  label: string,
  shortLabel: string,
  icon: IconName,
  description: string,
  gradient: string,
  active: HabitInput[],
  passive: HabitInput[],
  marketing: HabitInput[],
  strategy: HabitInput[]
): Profession {
  return {
    id, label, shortLabel, icon, description, gradient,
    presets: [
      ...group("active", active), ...group("passive", passive),
      ...group("marketing", marketing), ...group("strategy", strategy),
    ],
  };
}

// 72 ready-made habits: 12 for each field, balanced across four practice types.
export const professions: Profession[] = [
  profession("frontend", "Разработка и ИТ", "Разработка", "Code2", "Развивайте инженерные навыки, не забывая о здоровье и росте в карьере.", "from-indigo-500 to-violet-500",
    [["Решить задачу по алгоритмам", "Алгоритмы", 25, "medium", "Terminal"], ["Изучить новую возможность языка", "Обучение", 20, "medium", "Code2"], ["Собрать небольшой компонент", "Практика", 30, "hard", "LayoutGrid"]],
    [["Сделать гимнастику для глаз", "Здоровье", 5, "easy", "Eye"], ["Размяться после часа работы", "Эргономика", 5, "easy", "Dumbbell"], ["Пройтись на свежем воздухе", "Восстановление", 15, "easy", "Coffee"]],
    [["Обновить портфолио одним примером", "Портфолио", 20, "medium", "FileText"], ["Изучить страницу компании мечты", "Карьерный рост", 15, "easy", "TrendingUp"], ["Опубликовать заметку о решении задачи", "Профессиональный бренд", 20, "medium", "Megaphone"]],
    [["Разобрать архитектурное решение", "Архитектура", 25, "hard", "LayoutGrid"], ["Провести вдумчивое ревью кода", "Качество", 20, "medium", "GitBranch"], ["Записать технический план на день", "Планирование", 10, "easy", "Target"]]),
  profession("uxui", "Дизайн интерфейсов", "Дизайн", "PenTool", "Углубляйте визуальную практику, исследование и продуктовое мышление.", "from-fuchsia-500 to-pink-500",
    [["Нарисовать вариант ключевого экрана", "Практика", 30, "hard", "Palette"], ["Разобрать интерфейс одного продукта", "Насмотренность", 20, "medium", "Smartphone"], ["Изучить паттерн дизайн-системы", "Дизайн-системы", 20, "medium", "LayoutGrid"]],
    [["Сделать паузу для глаз", "Здоровье", 5, "easy", "Eye"], ["Размять кисти и плечи", "Эргономика", 5, "easy", "Dumbbell"], ["Пройтись без экрана", "Восстановление", 15, "easy", "Coffee"]],
    [["Описать кейс для портфолио", "Портфолио", 25, "medium", "FileText"], ["Поделиться выводом из исследования", "Профессиональный бренд", 15, "easy", "Megaphone"], ["Сравнить вакансии продуктового дизайнера", "Карьерный рост", 15, "easy", "TrendingUp"]],
    [["Сформулировать гипотезу улучшения", "Продуктовое мышление", 15, "medium", "Target"], ["Проверить макет по доступности", "Качество", 20, "medium", "Eye"], ["Составить карту пользовательского пути", "Исследование", 25, "hard", "Users"]]),
  profession("data", "Данные и аналитика", "Аналитика", "BarChart3", "Практикуйте анализ данных, ясную коммуникацию и работу с метриками.", "from-cyan-500 to-blue-500",
    [["Написать запрос с оконной функцией", "SQL", 25, "medium", "Terminal"], ["Разобрать один метод статистики", "Статистика", 20, "medium", "BarChart3"], ["Построить график по небольшому набору данных", "Визуализация", 30, "hard", "TrendingUp"]],
    [["Отвести взгляд от монитора", "Здоровье", 5, "easy", "Eye"], ["Размять спину и плечи", "Эргономика", 5, "easy", "Dumbbell"], ["Пройтись во время перерыва", "Восстановление", 15, "easy", "Coffee"]],
    [["Добавить проект в аналитическое портфолио", "Портфолио", 20, "medium", "FileText"], ["Опубликовать короткий разбор данных", "Профессиональный бренд", 20, "medium", "Megaphone"], ["Изучить требования к интересующей роли", "Карьерный рост", 15, "easy", "TrendingUp"]],
    [["Записать метрику и критерий успеха", "Метрики", 10, "easy", "Target"], ["Проверить качество входных данных", "Качество", 20, "medium", "Target"], ["Сформулировать вывод без жаргона", "Коммуникация", 15, "medium", "Users"]]),
  profession("marketing", "Маркетинг и рост", "Маркетинг", "Megaphone", "Соединяйте аналитику, контент, эксперименты и стратегию роста.", "from-orange-500 to-amber-500",
    [["Разобрать рекламный эксперимент", "Эксперименты", 20, "medium", "BarChart3"], ["Написать вариант посадочного текста", "Копирайтинг", 25, "hard", "PenToolIcon"], ["Изучить новый инструмент продвижения", "Обучение", 20, "medium", "TrendingUp"]],
    [["Отойти от экрана и размяться", "Восстановление", 10, "easy", "Dumbbell"], ["Сделать паузу для глаз", "Здоровье", 5, "easy", "Eye"], ["Пройтись без телефона", "Баланс", 15, "easy", "Coffee"]],
    [["Изучить одну аудиторию конкурента", "Исследование", 20, "medium", "Users"], ["Опубликовать полезный разбор кампании", "Профессиональный бренд", 20, "medium", "Megaphone"], ["Проверить новую гипотезу роста", "Рост", 25, "hard", "Target"]],
    [["Сверить канал с целями квартала", "Стратегия", 15, "medium", "Target"], ["Разобрать воронку по этапам", "Аналитика", 20, "medium", "TrendingUp"], ["Запланировать контент на неделю", "Планирование", 15, "easy", "LayoutGrid"]]),
  profession("content", "Контент и медиа", "Контент", "FileText", "Развивайте ремесло автора, устойчивый ритм публикаций и медиастратегию.", "from-rose-500 to-orange-500",
    [["Написать черновик короткой статьи", "Создание", 30, "hard", "PenToolIcon"], ["Смонтировать короткий фрагмент видео", "Продакшен", 25, "medium", "Smartphone"], ["Разобрать сильный заголовок", "Редактура", 15, "easy", "FileText"]],
    [["Размять глаза и кисти", "Здоровье", 5, "easy", "Eye"], ["Сделать перерыв после монтажа", "Эргономика", 10, "easy", "Dumbbell"], ["Набраться идей на прогулке", "Восстановление", 15, "easy", "Coffee"]],
    [["Проверить отклик аудитории на публикацию", "Рост", 15, "medium", "TrendingUp"], ["Поделиться рабочим процессом", "Профессиональный бренд", 20, "medium", "Megaphone"], ["Изучить формат у создателя из ниши", "Исследование", 20, "medium", "Users"]],
    [["Собрать недельный редакционный план", "Планирование", 20, "medium", "LayoutGrid"], ["Сформулировать цель следующего материала", "Стратегия", 10, "easy", "Target"], ["Проверить публикацию по чек-листу", "Качество", 10, "easy", "Target"]]),
  profession("pm", "Управление продуктом", "Продукт", "Target", "Укрепляйте продуктовое мышление, коммуникацию и работу с данными.", "from-emerald-500 to-teal-500",
    [["Изучить один продуктовый кейс", "Обучение", 20, "medium", "FileText"], ["Разобрать пользовательский сценарий", "Исследование", 20, "medium", "Users"], ["Проверить метрику продукта", "Аналитика", 15, "easy", "BarChart3"]],
    [["Сделать паузу для глаз", "Здоровье", 5, "easy", "Eye"], ["Размяться между встречами", "Эргономика", 10, "easy", "Dumbbell"], ["Освободить короткое окно без встреч", "Восстановление", 15, "easy", "Coffee"]],
    [["Попросить обратную связь у пользователя", "Исследование", 20, "medium", "Users"], ["Поделиться продуктовыми выводами", "Профессиональный бренд", 15, "easy", "Megaphone"], ["Изучить требования к следующему уровню роли", "Карьерный рост", 15, "easy", "TrendingUp"]],
    [["Обновить приоритеты бэклога", "Планирование", 20, "medium", "LayoutGrid"], ["Сформулировать критерий успеха задачи", "Стратегия", 10, "easy", "Target"], ["Подготовить повестку синхронизации", "Команда", 15, "medium", "Users"]]),
];

export const professionMap = Object.fromEntries(
  professions.map((p) => [p.id, p])
) as Record<ProfessionId, Profession>;

export type ExperienceLevel = "junior" | "middle" | "senior" | "lead";
export const experienceLevels: { id: ExperienceLevel; label: string; description: string }[] = [
  { id: "junior", label: "Начальный", description: "Формирую основу и привычку учиться" },
  { id: "middle", label: "Уверенный", description: "Углубляю практику и самостоятельность" },
  { id: "senior", label: "Опытный", description: "Расширяю влияние и экспертизу" },
  { id: "lead", label: "Руководящий", description: "Развиваю команду и системное мышление" },
];

export type DailyTargetId = "15min" | "30min" | "1hour" | "2hours";
export const dailyTargets: { id: DailyTargetId; label: string; minutes: number }[] = [
  { id: "15min", label: "15 минут", minutes: 15 },
  { id: "30min", label: "30 минут", minutes: 30 },
  { id: "1hour", label: "1 час", minutes: 60 },
  { id: "2hours", label: "2 часа и больше", minutes: 120 },
];
export const dailyTargetMap = Object.fromEntries(
  dailyTargets.map((t) => [t.id, { label: t.label, minutes: t.minutes }])
) as Record<DailyTargetId, { label: string; minutes: number }>;

export type PrimaryGoalId = "career" | "recovery" | "switch" | "expertise";
export const primaryGoals: { id: PrimaryGoalId; label: string; description: string }[] = [
  { id: "career", label: "Быстрый карьерный рост", description: "Усилить навыки и подготовиться к следующему уровню" },
  { id: "recovery", label: "Восстановление после выгорания", description: "Вернуть устойчивый ритм и заботу о себе" },
  { id: "switch", label: "Смена направления", description: "Освоить новую область и собрать практику" },
  { id: "expertise", label: "Глубокая экспертиза", description: "Системно развивать ключевую специализацию" },
];
export type HabitFocusId = "balanced" | "hard_skills" | "wellness" | "growth";
export const habitFocuses: { id: HabitFocusId; label: string; description: string }[] = [
  { id: "balanced", label: "Сбалансированный", description: "Понемногу из каждой области" },
  { id: "hard_skills", label: "Активные навыки", description: "Практика и профессиональные умения" },
  { id: "wellness", label: "Здоровье и восстановление", description: "Устойчивый темп, энергия и эргономика" },
  { id: "growth", label: "Маркетинг и стратегия", description: "Рост, коммуникация и влияние" },
];
export type TrackingMode = "flexible" | "strict";
export const trackingModes: { id: TrackingMode; label: string; description: string }[] = [
  { id: "flexible", label: "Гибкий", description: "Серия сохраняется при любой выполненной привычке" },
  { id: "strict", label: "Строгий", description: "Для серии нужно завершить весь план дня" },
];

import type { ProfessionId, IconName, Difficulty } from "../data/professions";

interface GeneratedHabit {
  title: string;
  category: string;
  minutes: number;
  difficulty: Difficulty;
  icon: IconName;
}

interface GoalTemplate {
  matchers: string[];
  habits: GeneratedHabit[];
}

const templates: GoalTemplate[] = [
  {
    matchers: ["senior", "сеньор", "лид", "lead", "архитект"],
    habits: [
      { title: "Изучение паттернов проектирования", category: "Архитектура", minutes: 30, difficulty: "hard", icon: "LayoutGrid" },
      { title: "Code review коллеги", category: "Качество", minutes: 20, difficulty: "medium", icon: "GitBranch" },
      { title: "Написание технического документа", category: "Документация", minutes: 25, difficulty: "medium", icon: "FileText" },
    ],
  },
  {
    matchers: ["алгоритм", "leetcode", "собесед", "интервью", "задач"],
    habits: [
      { title: "Решение алгоритмической задачи", category: "Алгоритмы", minutes: 30, difficulty: "hard", icon: "Terminal" },
      { title: "Разбор решения на LeetCode", category: "Алгоритмы", minutes: 15, difficulty: "medium", icon: "Code2" },
      { title: "Повторение структуры данных", category: "Обучение", minutes: 20, difficulty: "medium", icon: "FileText" },
    ],
  },
  {
    matchers: ["дизайн", "ux", "ui", "интерфейс", "пользователь"],
    habits: [
      { title: "Анализ UX одного продукта", category: "Исследование", minutes: 20, difficulty: "medium", icon: "Smartphone" },
      { title: "Скetch экрана в фигме", category: "Практика", minutes: 30, difficulty: "medium", icon: "Palette" },
      { title: "Чтение статьи по UX", category: "Обучение", minutes: 15, difficulty: "easy", icon: "FileText" },
    ],
  },
  {
    matchers: ["английск", "english", "язык", "ielts"],
    habits: [
      { title: "Чтение технической статьи на английском", category: "Языки", minutes: 20, difficulty: "medium", icon: "FileText" },
      { title: "Прослушивание подкаста на английском", category: "Языки", minutes: 15, difficulty: "easy", icon: "Coffee" },
      { title: "Практика 10 новых терминов", category: "Языки", minutes: 10, difficulty: "easy", icon: "Target" },
    ],
  },
  {
    matchers: ["портфолио", "пет", "pet", "проект", "github"],
    habits: [
      { title: "Разработка пет-проекта 30 мин", category: "Практика", minutes: 30, difficulty: "hard", icon: "Code2" },
      { title: "Написание README для проекта", category: "Документация", minutes: 15, difficulty: "easy", icon: "FileText" },
      { title: "Деплой и тестирование", category: "Практика", minutes: 20, difficulty: "medium", icon: "GitBranch" },
    ],
  },
  {
    matchers: ["soft skill", "команд", "communicat", "общение", "презентац"],
    habits: [
      { title: "Презентация своей работы команде", category: "Soft Skills", minutes: 20, difficulty: "medium", icon: "Users" },
      { title: "Чтение книги по коммуникации", category: "Обучение", minutes: 20, difficulty: "easy", icon: "FileText" },
      { title: "Спарринг идей с коллегой", category: "Soft Skills", minutes: 15, difficulty: "medium", icon: "Users" },
    ],
  },
  {
    matchers: ["здоров", "спорт", "фитнес", "зарядк", "здоровь"],
    habits: [
      { title: "Утренняя зарядка 15 мин", category: "Здоровье", minutes: 15, difficulty: "easy", icon: "Dumbbell" },
      { title: "Гимнастика для глаз", category: "Здоровье", minutes: 5, difficulty: "easy", icon: "Eye" },
      { title: "Прогулка на свежем воздухе", category: "Здоровье", minutes: 20, difficulty: "easy", icon: "Coffee" },
    ],
  },
  {
    matchers: ["читать", "книг", "read", "статей"],
    habits: [
      { title: "Чтение главы технической книги", category: "Обучение", minutes: 25, difficulty: "easy", icon: "FileText" },
      { title: "Конспект прочитанного", category: "Обучение", minutes: 10, difficulty: "easy", icon: "FileText" },
      { title: "Обсуждение статьи с коллегой", category: "Обучение", minutes: 15, difficulty: "medium", icon: "Users" },
    ],
  },
];

const fallbackHabits: GeneratedHabit[] = [
  { title: "Глубокая работа над задачей 30 мин", category: "Фокус", minutes: 30, difficulty: "hard", icon: "Target" },
  { title: "Изучение новой темы по специальности", category: "Обучение", minutes: 20, difficulty: "medium", icon: "FileText" },
  { title: "Рефлексия дня в блокноте", category: "Развитие", minutes: 10, difficulty: "easy", icon: "PenToolIcon" },
];

export function generateHabits(goal: string, _professionId: ProfessionId): GeneratedHabit[] {
  const lower = goal.toLowerCase().trim();
  if (!lower) return fallbackHabits;

  for (const template of templates) {
    if (template.matchers.some((m) => lower.includes(m))) {
      return template.habits;
    }
  }
  return fallbackHabits;
}

export type { GeneratedHabit };

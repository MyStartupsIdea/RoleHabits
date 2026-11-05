import type { ExperienceLevel } from "../data/professions";

export const XP_PER_HABIT = 50;

export type Level = ExperienceLevel | "lead";

export const levelOrder: Level[] = ["junior", "middle", "senior", "lead"];

export const levelLabels: Record<Level, string> = {
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
  lead: "Lead",
};

export interface LevelInfo {
  level: Level;
  levelIndex: number;
  xpInLevel: number;
  xpForNextLevel: number;
  progress: number;
  totalXp: number;
}

export function xpThresholdForLevel(index: number): number {
  return index * 1000;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let levelIndex = 0;
  for (let i = levelOrder.length - 1; i >= 0; i--) {
    if (totalXp >= xpThresholdForLevel(i)) {
      levelIndex = i;
      break;
    }
  }
  const level = levelOrder[levelIndex];
  const isMax = levelIndex === levelOrder.length - 1;
  const currentThreshold = xpThresholdForLevel(levelIndex);
  const nextThreshold = isMax
    ? currentThreshold
    : xpThresholdForLevel(levelIndex + 1);
  const xpInLevel = totalXp - currentThreshold;
  const xpForNextLevel = isMax ? 0 : nextThreshold - currentThreshold;
  const progress = isMax ? 100 : (xpInLevel / xpForNextLevel) * 100;
  return {
    level,
    levelIndex,
    xpInLevel,
    xpForNextLevel,
    progress,
    totalXp,
  };
}

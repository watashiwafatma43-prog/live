import { useState, useCallback } from "react";
import { grades } from "@/data/content";
import { BADGES } from "@/data/badges";

export interface Progress {
  scenarios: Record<string, "red" | "yellow" | "green" | "done">;
  quizScores: Record<number, number>;
  gameBestScores: Record<number, number>;
  tfBestScores: Record<number, number>;
  personalityDone: number;
  earnedBadges: string[];
}

const STORAGE_KEY = "hayatak_progress";

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { tfBestScores: {}, personalityDone: 0, ...parsed };
    }
  } catch {}
  return { scenarios: {}, quizScores: {}, gameBestScores: {}, tfBestScores: {}, personalityDone: 0, earnedBadges: [] };
}

function saveProgress(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}

function computeNewBadges(p: Progress): string[] {
  const newBadges: string[] = [];

  const tryEarn = (id: string) => {
    if (!p.earnedBadges.includes(id)) newBadges.push(id);
  };

  const completedScenarios = Object.keys(p.scenarios);
  const greenCount = Object.values(p.scenarios).filter((v) => v === "green").length;
  const quizGrades = Object.keys(p.quizScores).map(Number);
  const gameGrades = Object.keys(p.gameBestScores).map(Number);
  const tfGrades = Object.keys(p.tfBestScores ?? {}).map(Number);

  // Scenario badges
  if (completedScenarios.length >= 1) tryEarn("first_step");
  if (greenCount >= 1) tryEarn("good_choice");
  if (greenCount >= 3) tryEarn("three_greens");
  if (greenCount >= 5) tryEarn("five_greens");
  if (greenCount >= 10) tryEarn("ten_greens");
  if (completedScenarios.length >= 5) tryEarn("five_scenarios");
  if (completedScenarios.length >= 10) tryEarn("ten_scenarios");

  const allScenarioIds = grades.flatMap((g) => g.subjects.flatMap((s) => s.scenarios.map((sc) => sc.id)));
  if (allScenarioIds.every((id) => completedScenarios.includes(id))) tryEarn("all_scenarios");

  // Quiz badges
  if (quizGrades.length >= 1) tryEarn("quiz_starter");
  if (quizGrades.some((g) => p.quizScores[g] === 100)) tryEarn("quiz_hero");
  if ([4, 5, 6].every((g) => quizGrades.includes(g))) tryEarn("quiz_all");
  if ([4, 5, 6].every((g) => quizGrades.includes(g) && p.quizScores[g] === 100)) tryEarn("quiz_perfectx3");

  // Match game badges
  if (gameGrades.length >= 1) tryEarn("game_player");
  if (gameGrades.some((g) => p.gameBestScores[g] >= 90)) tryEarn("game_master");
  if ([4, 5, 6].every((g) => gameGrades.includes(g))) tryEarn("game_all");

  // True/False game badges
  if (tfGrades.length >= 1) tryEarn("tf_player");
  if (tfGrades.some((g) => (p.tfBestScores ?? {})[g] >= 80)) tryEarn("tf_master");
  if ([4, 5, 6].every((g) => tfGrades.includes(g))) tryEarn("tf_all");

  // Grade completion badges
  [4, 5, 6].forEach((gradeId) => {
    const grade = grades.find((g) => g.id === gradeId);
    if (!grade) return;
    const allIds = grade.subjects.flatMap((s) => s.scenarios.map((sc) => sc.id));
    if (allIds.every((id) => completedScenarios.includes(id))) {
      tryEarn(`grade${gradeId}_done`);
    }
  });

  if (allScenarioIds.every((id) => completedScenarios.includes(id))) tryEarn("all_grades");

  return newBadges;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [newlyEarned, setNewlyEarned] = useState<string[]>([]);

  const update = useCallback((updater: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = updater(prev);
      const freshBadges = computeNewBadges(next);
      if (freshBadges.length > 0) {
        next.earnedBadges = [...prev.earnedBadges, ...freshBadges];
        setNewlyEarned(freshBadges);
        setTimeout(() => setNewlyEarned([]), 4000);
      }
      saveProgress(next);
      return { ...next };
    });
  }, []);

  const markScenario = useCallback((scenarioId: string, choice: "red" | "yellow" | "green") => {
    update((p) => ({
      ...p,
      scenarios: { ...p.scenarios, [scenarioId]: choice },
    }));
  }, [update]);

  const saveQuizScore = useCallback((gradeId: number, pct: number) => {
    update((p) => ({
      ...p,
      quizScores: {
        ...p.quizScores,
        [gradeId]: Math.max(p.quizScores[gradeId] ?? 0, pct),
      },
    }));
  }, [update]);

  const saveGameScore = useCallback((gradeId: number, score: number) => {
    update((p) => ({
      ...p,
      gameBestScores: {
        ...p.gameBestScores,
        [gradeId]: Math.max(p.gameBestScores[gradeId] ?? 0, score),
      },
    }));
  }, [update]);

  const saveTFScore = useCallback((gradeId: number, pct: number) => {
    update((p) => ({
      ...p,
      tfBestScores: {
        ...(p.tfBestScores ?? {}),
        [gradeId]: Math.max((p.tfBestScores ?? {})[gradeId] ?? 0, pct),
      },
    }));
  }, [update]);

  const savePersonalityScore = useCallback((val: number) => {
    update((p) => ({
      ...p,
      personalityDone: Math.max(p.personalityDone ?? 0, val),
    }));
  }, [update]);

  const resetProgress = useCallback(() => {
    const fresh: Progress = { scenarios: {}, quizScores: {}, gameBestScores: {}, tfBestScores: {}, personalityDone: 0, earnedBadges: [] };
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  const earnedBadgeObjects = BADGES.filter((b) => progress.earnedBadges.includes(b.id));
  const newlyEarnedBadgeObjects = BADGES.filter((b) => newlyEarned.includes(b.id));

  return {
    progress,
    earnedBadges: earnedBadgeObjects,
    newlyEarnedBadges: newlyEarnedBadgeObjects,
    markScenario,
    saveQuizScore,
    saveGameScore,
    saveTFScore,
    savePersonalityScore,
    resetProgress,
  };
}

export type ProgressStore = ReturnType<typeof useProgress>;

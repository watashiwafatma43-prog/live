import { useState, useEffect } from "react";

const STREAK_KEY = "hayatak_streak";

interface StreakData {
  count: number;
  lastVisit: string;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastVisit: "" };
}

function saveStreak(data: StreakData) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {}
}

export function useStreak() {
  const [streak, setStreak] = useState<number>(0);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const today = todayStr();
    const data = loadStreak();

    if (data.lastVisit === today) {
      setStreak(data.count);
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let newCount: number;
    if (data.lastVisit === yesterdayStr) {
      newCount = data.count + 1;
      setIsNew(true);
    } else {
      newCount = 1;
      if (data.lastVisit !== "") setIsNew(true);
    }

    const updated = { count: newCount, lastVisit: today };
    saveStreak(updated);
    setStreak(newCount);
  }, []);

  return { streak, isNew };
}

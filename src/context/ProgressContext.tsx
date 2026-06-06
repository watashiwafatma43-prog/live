import { createContext, useContext, ReactNode } from "react";
import { useProgress, ProgressStore } from "@/hooks/useProgress";

const ProgressContext = createContext<ProgressStore | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const store = useProgress();
  return <ProgressContext.Provider value={store}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgressContext must be inside ProgressProvider");
  return ctx;
}
